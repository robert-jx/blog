# 简易记事本的实现

这里展示一个简易记事本的实现过程，主要使用 tkinter 来实现 GUI 程序的界面以及文件的交互

## 代码

```python
import tkinter as tk  # 导入tkinter库，用于创建图形用户界面
from tkinter import filedialog  # 导入文件对话框模块


def new_file():
    """清空文本区域以创建新文件"""
    text.delete(1.0, tk.END)


def open_file():
    """打开文件并将其内容加载到文本区域"""
    file_path = filedialog.askopenfilename()  # 弹出文件选择对话框
    with open(file_path, 'r') as file:  # 以只读模式打开文件
        text.delete(1.0, tk.END)  # 清空文本区域
        text.insert(tk.END, file.read())  # 将文件内容插入文本区域


def save_file():
    """将文本区域的内容保存到文件"""
    file_path = filedialog.asksaveasfilename(defaultextension=".txt")  # 弹出保存对话框
    with open(file_path, 'w') as file:  # 以写入模式打开文件
        file.write(text.get(1.0, tk.END))  # 将文本区域内容写入文件


# 创建主窗口
app = tk.Tk()
app.title("记事本")  # 设置窗口标题
# app.iconbitmap('test.ico')

# 创建文本区域，并使其可扩展以填充窗口
text = tk.Text(app)
text.pack(expand=True, fill='both')

# 创建菜单
menu = tk.Menu(app)
app.config(menu=menu)

# 创建文件菜单
file_menu = tk.Menu(menu)
menu.add_cascade(label="文件", menu=file_menu)  # 将文件菜单添加到主菜单
file_menu.add_command(label="新建", command=new_file)  # 新建文件命令
file_menu.add_command(label="打开", command=open_file)  # 打开文件命令
file_menu.add_command(label="保存", command=save_file)  # 保存文件命令

# 启动主事件循环
app.mainloop()
```