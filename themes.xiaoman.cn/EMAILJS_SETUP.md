# EmailJS 邮件服务配置指南

## 简介

EmailJS 是一个成熟的邮件服务，允许您直接从前端发送邮件，无需后端服务器。它支持多种邮件服务提供商（Gmail、Outlook、SendGrid、Mailgun 等）。

## 优势

- ✅ **无需后端**：直接从浏览器发送邮件
- ✅ **免费套餐**：每月 200 封免费邮件
- ✅ **易于集成**：只需几行代码
- ✅ **可靠稳定**：成熟的商业服务
- ✅ **支持多种邮件服务**：Gmail、Outlook、SendGrid 等

## 配置步骤

### 1. 注册 EmailJS 账号

访问 [https://www.emailjs.com/](https://www.emailjs.com/) 并注册账号。

### 2. 创建邮件服务

1. 登录后，进入 **Email Services** 页面
2. 点击 **Add New Service**
3. 选择您的邮件服务提供商（推荐：Gmail 或 SendGrid）
4. 按照提示完成配置
5. 记录 **Service ID**

### 3. 创建邮件模板

1. 进入 **Email Templates** 页面
2. 点击 **Create New Template**
3. 使用以下模板内容：

```
Subject: Quote Request for {{product_name}}

Dear SAINT PETROCHEMICAL LIMITED,

You have received a new quote request:

Product: {{product_name}}
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}

Message:
{{message}}

---
Page: {{page_title}}
Link: {{page_link}}

Reply to: {{reply_to}}
```

4. 保存模板并记录 **Template ID**

### 4. 获取 Public Key

1. 进入 **Account** > **General** 页面
2. 找到 **Public Key** 并复制

### 5. 配置网站

在 `products/detail.html` 文件中，找到以下代码并取消注释：

```html
<script>
  window.EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',      // 替换为您的 Public Key
    SERVICE_ID: 'YOUR_SERVICE_ID',      // 替换为您的 Service ID
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',     // 替换为您的 Template ID
    TO_EMAIL: 'INFO@SAINTPEC.COM'
  };
</script>
<script type="text/javascript" src="../static/js/emailjs-integration.js"></script>
```

然后在表单上添加 `data-use-emailjs` 属性：

```html
<form name="quoteform" class="crm-form quote-form" data-use-emailjs>
```

## 使用方式

### 方式一：使用 EmailJS（推荐）

1. 完成上述配置
2. 在表单上添加 `data-use-emailjs` 属性
3. 用户提交表单时，邮件将通过 EmailJS 发送

### 方式二：使用原有 API

保持现有配置不变，表单将通过后端 API 发送。

### 方式三：使用邮件客户端

点击 "Send via Email" 按钮，打开用户的邮件客户端。

## 费用说明

- **免费套餐**：每月 200 封邮件
- **付费套餐**：从 $15/月起，支持更多邮件数量

## 其他邮件服务推荐

如果 EmailJS 不满足需求，还可以考虑：

1. **SendGrid** - 强大的邮件服务，免费套餐每月 100 封
2. **Mailgun** - 开发者友好的邮件服务，免费套餐每月 5,000 封
3. **AWS SES** - 亚马逊邮件服务，按使用量付费
4. **Postmark** - 专注于交易邮件，免费试用

## 技术支持

- EmailJS 文档：https://www.emailjs.com/docs/
- 支持邮箱：support@emailjs.com

