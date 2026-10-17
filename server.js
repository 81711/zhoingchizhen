require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// 托管当前文件夹的所有静态文件(html、mp4、图片)
app.use(express.static(__dirname));

// 访问根路径 / 自动返回 index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 从环境变量读取火山方舟凭证
const API_KEY = process.env.API_KEY;
const ENDPOINT_ID = process.env.ENDPOINT_ID;

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const url = `https://ark.cn-beijing.volces.com/api/v3/chat/completions`;
        const result = await axios.post(url,
            {
                endpoint_id: ENDPOINT_ID,
                messages: messages,
                temperature: 0.7,
                max_tokens: 512
            },
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        const aiContent = result.data.choices[0].message.content;
        res.json({ answer: aiContent });
    } catch (err) {
        console.error("接口错误详情：", err.response?.data || err.message);
        res.status(500).json({ answer: "后端异常：" + err.message });
    }
});

app.listen(port, () => {
    console.log(`✅后端服务运行`);
});
