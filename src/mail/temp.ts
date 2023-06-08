export const codeTemplate = (code: string) => `<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <title>title</title>
        <style>
            span {
                font-size: 15px;
            }
        </style>
    </head>
    <body>
        <h3>尼嚎, 亲爱的用户</h3>
        <p>
            <span>您正在完成新用户注册验证，验证码为：</span>
            <span style="color: rgb(78,164,220)">${code}</span>
        </p>
        <p>请在30分钟内完成验证。</p>
        <p>delong</p>
        <p><span style="color:rgb(119,119,119);font-size:13px">此为系统邮件，请勿回复。</span></p>
    </body>
</html>
`
