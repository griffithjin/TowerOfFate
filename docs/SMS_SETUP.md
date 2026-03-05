
# 短信接口配置指南

## 推荐短信服务商（国内）

### 1. 阿里云短信服务（推荐）
- 官网: https://www.aliyun.com/product/sms
- 价格: 0.045元/条（验证码）
- 特点: 稳定，接口文档完善
- 需要: 阿里云账号 + 企业认证/个人认证

### 2. 腾讯云短信
- 官网: https://cloud.tencent.com/product/sms
- 价格: 0.045元/条
- 特点: 腾讯生态，审核快
- 需要: 腾讯云账号 + 实名认证

### 3. 容联云通讯
- 官网: https://www.yuntongxun.com/
- 价格: 0.05元/条
- 特点: 专业通讯服务商
- 需要: 企业认证

## 接入代码示例（阿里云）

```python
# server/sms_service.py
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
import json

class SMSService:
    def __init__(self):
        # 明天申请后填入
        self.access_key_id = "YOUR_ACCESS_KEY_ID"
        self.access_key_secret = "YOUR_ACCESS_KEY_SECRET"
        self.sign_name = "命运塔"  # 短信签名
        self.template_code = "SMS_12345678"  # 验证码模板
        
        self.client = AcsClient(
            self.access_key_id,
            self.access_key_secret,
            'cn-hangzhou'
        )
    
    def send_verify_code(self, phone, code):
        """发送验证码"""
        request = CommonRequest()
        request.set_accept_format('json')
        request.set_domain('dysmsapi.aliyuncs.com')
        request.set_method('POST')
        request.set_protocol_type('https')
        request.set_version('2017-05-25')
        request.set_action_name('SendSms')
        
        request.add_query_param('PhoneNumbers', phone)
        request.add_query_param('SignName', self.sign_name)
        request.add_query_param('TemplateCode', self.template_code)
        request.add_query_param('TemplateParam', json.dumps({"code": code}))
        
        response = self.client.do_action_with_exception(request)
        return json.loads(response)
```

## API配置（server/api.py）

```python
# 添加到 api.py
from sms_service import SMSService

sms_service = SMSService()

@app.route('/api/sms/send', methods=['POST'])
def send_sms():
    """发送短信验证码"""
    data = request.json
    phone = data.get('phone')
    
    # 生成验证码
    code = ''.join(random.choices(string.digits, k=6))
    
    # 发送短信（明天接入）
    # result = sms_service.send_verify_code(phone, code)
    
    # 存储验证码
    conn = sqlite3.connect('toweroffate.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO verify_codes (phone, code, expires_at)
        VALUES (?, ?, datetime('now', '+5 minutes'))
    ''', (phone, code))
    conn.commit()
    conn.close()
    
    return jsonify({
        'code': 200,
        'message': '验证码已发送'
    })
```

## 前端调用

```javascript
// 发送短信验证码
async function sendPhoneVerify() {
    const phone = document.getElementById('phone').value;
    
    const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    if(data.code === 200) {
        alert('验证码已发送');
    }
}
```

## 申请流程（明天操作）

1. **注册阿里云账号**
2. **完成实名认证**（个人/企业）
3. **开通短信服务**
4. **申请短信签名**（如：命运塔）
5. **申请短信模板**（验证码模板）
6. **充值短信套餐**（建议先充50元测试）
7. **获取AccessKey**（用于API调用）
8. **填入配置文件**

## 注意事项

- 短信签名需要审核（1-2工作日）
- 个人认证有发送限制（建议企业认证）
- 必须遵守短信发送规范
- 验证码有效期建议5分钟
- 同一手机号每分钟只能发1条
