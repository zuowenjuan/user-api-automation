import requests 
import pytest 
import logging 
from config import BASE_URL, LOG_LEVEL, LOG_FILE
logging.basicConfig(     
    level=getattr(logging, LOG_LEVEL),     
    format='%(asctime)s - %(levelname)s - %(message)s',     
    handlers=[         
        logging.FileHandler(LOG_FILE, encoding='utf-8', mode='w'),  
        logging.StreamHandler()     
    ],     
    force=True  
 )  
logger = logging.getLogger(__name__)
@pytest.fixture 
def api_url():     
    return BASE_URL  
def test_api_test(api_url):     
    url = f"{api_url}/api/test"     
    logger.info(f"发送请求: {url}")     
    response = requests.get(url)     
    logger.info(f"响应状态码: {response.status_code}")     
    assert response.status_code == 200     
    logger.info("✅ /api/test 测试通过")  
def test_random_user(api_url):     
    url = f"{api_url}/api/users/random"        
    logger.info(f"发送请求: {url}")     
    response = requests.get(url)     
    logger.info(f"响应状态码: {response.status_code}")     
    assert response.status_code == 200     
    logger.info("✅ /api/users/random 测试通过")  
def test_user_1(api_url):     
    url = f"{api_url}/api/users/1"     
    logger.info(f"发送请求: {url}")     
    response = requests.get(url)     
    logger.info(f"状态码: {response.status_code}")     
    assert response.status_code == 200     
    assert "id" in response.text or "name" in response.text     
    logger.info("✅ /api/users/1 测试通过")  
def test_user_1_profile(api_url):     
    url = f"{api_url}/api/users/1/profile"     
    logger.info(f"发送请求: {url}")     
    response = requests.get(url)     
    logger.info(f"状态码: {response.status_code}")     
    assert response.status_code == 200     
    logger.info("✅ /api/users/1/profile 测试通过")  
@pytest.mark.parametrize("username, password, expected_status", [     
    ("admin", "123456", 200),     
    ("admin", "wrong", 401),     
    ("wrong", "123456", 401),     
    ("", "123456", 401),     
    ("admin", "", 401), 
]) 
def test_login_cases(api_url, username, password, expected_status):     
    url = f"{api_url}/api/login"     
    data = {"username": username, "password": password}     
    logger.info(f"登录请求: {username}/{password}")     
    response = requests.post(url, json=data)     
    logger.info(f"期望状态码: {expected_status}, 实际: {response.status_code}")     
    assert response.status_code == expected_status     
    logger.info(f"✅ 登录测试通过: {username}/{password}")
