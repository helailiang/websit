/**
 * EmailJS 邮件服务集成
 * 使用 EmailJS 发送报价请求邮件
 * 
 * 配置说明：
 * 1. 访问 https://www.emailjs.com/ 注册账号
 * 2. 创建邮件服务（支持 Gmail, Outlook, SendGrid 等）
 * 3. 创建邮件模板
 * 4. 获取以下配置信息：
 *    - Public Key (USER_ID)
 *    - Service ID
 *    - Template ID
 * 
 * 配置示例：
 * window.EMAILJS_CONFIG = {
 *   PUBLIC_KEY: 'your_public_key',
 *   SERVICE_ID: 'your_service_id',
 *   TEMPLATE_ID: 'your_template_id',
 *   TO_EMAIL: 'INFO@SAINTPEC.COM'
 * };
 */

(function() {
  'use strict';

  // EmailJS 配置（需要替换为实际值）
  const EMAILJS_CONFIG = window.EMAILJS_CONFIG || {
    PUBLIC_KEY: '3-nYcO8NPT53iUxyN',  // 从 EmailJS 获取
    SERVICE_ID: 'service_3g6m9wq',  // 从 EmailJS 获取
    TEMPLATE_ID: 'template_wjg5wh4', // 从 EmailJS 获取
    TO_EMAIL: 'hllfight@163.com' // 接收邮件的地址，可改为 INFO@SAINTPEC.COM
  };

  // 检查是否已加载 EmailJS SDK
  function loadEmailJSSDK(callback) {
    if (window.emailjs) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function() {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      callback();
    };
    script.onerror = function() {
      console.error('Failed to load EmailJS SDK');
    };
    document.head.appendChild(script);
  }

  // 发送邮件
  function sendEmail(formData, successCallback, errorCallback) {
    if (!window.emailjs) {
      loadEmailJSSDK(function() {
        sendEmail(formData, successCallback, errorCallback);
      });
      return;
    }

    // 准备邮件模板参数
    const templateParams = {
      to_email: EMAILJS_CONFIG.TO_EMAIL,
      from_name: formData.name || 'Customer',
      from_email: formData.email || '',
      product_name: formData.product_name || 'Product Inquiry',
      phone: formData.phone || 'N/A',
      company: formData.company || 'N/A',
      message: formData.message || 'No message provided',
      page_title: formData.page_title || document.title,
      page_link: formData.page_link || window.location.href,
      reply_to: formData.email || EMAILJS_CONFIG.TO_EMAIL
    };

    // 发送邮件
    emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    )
    .then(function(response) {
      console.log('Email sent successfully!', response.status, response.text);
      if (successCallback) successCallback(response);
    })
    .catch(function(error) {
      console.error('Email sending failed:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  // 为报价表单添加 EmailJS 支持
  function initEmailJSForm() {
    const quoteForm = document.querySelector('.quote-form');
    if (!quoteForm) return;

     // 监听表单提交
     quoteForm.addEventListener('submit', function(e) {
       // 检查是否使用 EmailJS（通过 data-use-emailjs 属性）
       const useEmailJS = quoteForm.getAttribute('data-use-emailjs');
       if (!useEmailJS || useEmailJS === 'false') {
         return; // 使用原有的 form.js 处理
       }

      e.preventDefault();
      e.stopPropagation();

      const submitBtn = quoteForm.querySelector('.create-form-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      // 收集表单数据
      const formData = {
        name: quoteForm.querySelector('#quote-name')?.value || '',
        email: quoteForm.querySelector('#quote-email')?.value || '',
        phone: quoteForm.querySelector('#quote-phone')?.value || '',
        company: quoteForm.querySelector('#quote-company')?.value || '',
        message: quoteForm.querySelector('#quote-message')?.value || '',
        product_name: quoteForm.querySelector('#quote-product-name')?.value || 'Product Inquiry',
        page_title: document.title,
        page_link: window.location.href
      };

      // 验证必填字段
      if (!formData.name || !formData.email) {
        alert('Please fill in all required fields (Name and Email).');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit';
        }
        return;
      }

      // 发送邮件
      sendEmail(
        formData,
        function(response) {
          // 成功回调
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit';
          }
          
          // 显示成功消息
          showEmailResult(true, 'Email sent successfully! We will contact you soon.');
          
          // 重置表单
          quoteForm.reset();
          
          // 关闭弹窗
          setTimeout(function() {
            const modal = document.getElementById('quote-modal');
            if (modal) {
              modal.classList.remove('active');
              document.body.style.overflow = '';
            }
          }, 2000);
        },
        function(error) {
          // 失败回调
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit';
          }
          
          showEmailResult(false, 'Failed to send email. Please try again or use "Send via Email" button.');
        }
      );
    });
  }

  // 显示邮件发送结果
  function showEmailResult(success, message) {
    // 移除旧的消息
    const oldMsg = document.querySelector('.emailjs-result-message');
    if (oldMsg) {
      oldMsg.remove();
    }

    // 创建新消息
    const msgDiv = document.createElement('div');
    msgDiv.className = 'emailjs-result-message ' + (success ? 'success' : 'error');
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${success ? '#25AC39' : '#e74c3c'};
      color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10002;
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
    `;

    document.body.appendChild(msgDiv);

    // 3秒后自动移除
    setTimeout(function() {
      msgDiv.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(function() {
        msgDiv.remove();
      }, 300);
    }, 3000);
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailJSForm);
  } else {
    initEmailJSForm();
  }

  // 导出到全局
  window.EmailJSIntegration = {
    sendEmail: sendEmail,
    loadEmailJSSDK: loadEmailJSSDK
  };

})();

