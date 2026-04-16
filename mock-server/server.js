const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const port = 3000;

app.use(express.json());
app.get('/api/test', (req, res) => { 
    res.json({ message: 'Mock server is running!' });
});
app.get('/api/users/random', (req, res) => {
    res.json({  
       id: faker.number.int({ min: 1, max: 1000 }),  
       name: faker.person.fullName(),
       email: faker.internet.email(),
       age: faker.number.int({ min: 18, max: 80 }) 
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const users = {
        '1': { id: 1, name: 'zhangsan', age: 28 },  
        '2': { id: 2, name: 'lisi', age: 30 },
        '3': { id: 3, name: 'wangwu', age: 25 }
    }; 
    if (users[userId]) {   
      res.json(users[userId]); 
    } else { 
      res.status(404).json({ error: 'User not found' });
    }
});

app.get('/api/users', (req, res) => {  
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    const allUsers = Array.from({ length: 100 }, (_, i) => ({  
        id: i + 1, 
        name: faker.person.fullName(),   
        email: faker.internet.email(),   
        age: faker.number.int({ min: 18, max: 60 })  
    }));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);  
    res.json({  
       code: 0,   
       message: 'success', 
       data: {   
           list: paginatedUsers,     
           pagination: {        
               page,       
               limit,       
               total: allUsers.length,       
               totalPages: Math.ceil(allUsers.length / limit),        
               hasNext: endIndex < allUsers.length,       
               hasPrev: page > 1      
           }    
       }  
    });
});

app.get('/api/users/:id/profile', (req, res) => {  
    const userId = req.params.id;  
    const baseUser = {    
        '1': { name: '张三', email: 'zhangsan@example.com' },   
        '2': { name: '李四', email: 'lisi@example.com' },   
        '3': { name: '王五', email: 'wangwu@example.com' }
    };
    const userInfo = baseUser[userId] || {  
        name: '未知用户',   
        email: 'unknown@example.com' 
    };
    res.json({  
       id: parseInt(userId),  
       basic: {  
          name: userInfo.name,     
          email: userInfo.email,   
          age: faker.number.int({ min: 18, max: 60 }),   
          phone: faker.phone.number(),    
          avatar: faker.image.avatarGitHub()   
       },
       address: {  
           street: faker.location.streetAddress(), 
           city: faker.location.city(), 
           country: faker.location.country(),     
           coordinates: {  
               lat: faker.location.latitude(),        
               lng: faker.location.longitude()   
           }   
       },  
       company: {    
           name: faker.company.name(),   
           catchPhrase: faker.company.catchPhrase()
       },   
       orders: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({     
          orderId: faker.string.uuid().substring(0, 8).toUpperCase(),      
          amount: faker.commerce.price(),
          status: faker.helpers.arrayElement(['pending', 'paid', 'shipped'])   
       }))
    });
});

app.post('/api/object-examples', express.json(), (req, res) => {
    res.json({ 
    code: 0,  
    message: 'success', 
    data: {    
        user: {      
            id: 1,        
            profile: {        
               name: '张三',        
               age: 28,          
               contacts: {        
                   email: 'zhangsan@example.com',          
                   phone: '13800138000',           
                   address: {              
                       city: '北京',              
                       street: '长安街1号'            
                   }         
               }        
          },      
          settings: {       
              theme: 'dark',         
              notifications: {          
                  email: true,           
                  sms: false,          
                  push: true         
              }        
          }     
        }   
    }
    });
});

app.get('/api/error/500', (req, res) => {  
res.status(500).json({  
code: 500, 
error: 'InternalServerError',   
message: '服务器内部错误' 
});
});
app.get('/api/error/502', (req, res) => {
res.status(502).json({   
code: 502,   
error: 'BadGateway',   
message: '网关错误'
});
});

app.post('/api/login', express.json(), (req, res) => {
const { username, password } = req.body;
const users = { 
'admin': { password: '123456', name: '管理员' },  
'user': { password: '123456', name: '普通用户' }  
};
if (!users[username]) {
return res.status(401).json({ code: 1001, message: '用户不存在' });
}
if (users[username].password !== password) {   
return res.status(401).json({ code: 1002, message: '密码错误' });  
}
const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');  
res.json({    
code: 0, 
message: '登录成功',    
data: { token, user: { username, name: users[username].name } } 
});
});

app.get('/api/array-examples', (req, res) => {  
res.json({  
code: 0,    
message: 'success', 
data: {      
tags: ['测试', 'API', '自动化', 'Mock', 'Bruno'],     
scores: [85, 92, 78, 96, 88],    
users: [        
{ id: 1, name: '张三' }, 
{ id: 2, name: '李四' },      
{ id: 3, name: '王五' },       
{ id: 4, name: '赵六' }   
],
empty: []  
}
});
});

app.get('/api/user/profile', (req, res) => {
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {   
return res.status(401).json({ code: 1003, message: '未提供token' });
} 
res.json({   
code: 0,  
data: {      
id: 1,     
name: '管理员',      
email: 'admin@example.com'    
} 
});
});

app.listen(port, () => {  
console.log(`✔ Mock server running at:`);
console.log(`    http://localhost:${port}/api/test`);
console.log(`    http://localhost:${port}/api/users/random`); 
console.log(`    http://localhost:${port}/api/users/1`); 
console.log(`    http://localhost:${port}/api/users/1/profile`);
console.log(`    http://localhost:${port}/api/users?page=1&limit=5`);
console.log(`    http://localhost:${port}/api/object-examples`);
console.log(`    http://localhost:${port}/api/error/500`);
console.log(`    http://localhost:${port}/api/error/502`);
console.log(`    http://localhost:${port}/api/array-examples`);
console.log(`    http://localhost:${port}/api/login`);
console.log(`    http://localhost:${port}/api/user/profile`);
});