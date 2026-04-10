@echo off 
echo ======================================== 
echo 用户管理系统自动化测试 
echo 时间: %date% %time% 
echo ========================================  
REM 运行pytest并生成Junit格式报告 
pytest test_user_api.py -v --junitxml=report.xml  
echo ======================================== 
echo 测试完成，日志已保存到 test_log.txt 
echo ======================================== 
pause