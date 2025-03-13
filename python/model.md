# 调用 Ollama 使用大语言模型

最近研究了一下使用 `python` 实现简单对接热门的 ds 模型：

## 代码

```python
import ollama

# 调用 Ollama 使用大语言模型
response = ollama.generate(
    model="deepseek-r1:1.5b",  # 使用的模型名称
    prompt="你好"
)

# 打印生成的内容
print(response)
```