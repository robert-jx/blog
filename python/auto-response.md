# 实现简单的微信自动回复功能

研究了一下简单的自动回复功能，代码如下。其中存放回复内容的 csv 格式如下：


| 序号 | 关键词 | 回复内容 |
| --- | --- | --- |
|1|你好|你好|
|2|早上好|早上好|
|3|哈哈哈哈|呵呵呵呵|
|4|再见|明天见|

## 代码

```python
import pandas as pd
import numpy as np

from uiautomation import WindowControl

wx = WindowControl(
    Name='微信'
)

print(wx)

# 切换窗口
wx.SwitchToThisWindow()
# 寻找并绑定会话控件
hw = wx.ListControl(Name='会话')
print(hw)
# 通过 pd 读取数据
df = pd.read_csv('回复数据.csv',encoding='gb18030')
print(df)

# while 循环接受消息
while True:
    # 寻找未读的消息
    we = hw.TextControl(searchDepth=4)
    while not we.Exists(0):
        pass
    print('寻找未读的消息',we)
    # 假如存在未读消息
    if we.Name:
        # 点击未读消息
        we.Click(simulateMove=False)
        # 读取最后一条消息
        last_msg = wx.ListControl(Name='消息').GetChildren()[-1].Name
        print('读取最后一条消息',last_msg)
        # 提取关键字并作出判断
        msg = df.apply(lambda x: x['回复内容'] if x['关键词'] in last_msg else None, axis=1)
        # 筛选数据 移除空数据
        msg.dropna(axis=0,how='any',inplace=True)
        # 生成列表
        ar = np.array(msg).tolist()
        # 匹配到数据时
        if ar:
            # 输入数据并自动换行
            wx.SendKeys(ar[0].replace('{br}','{Shift}{Enter}'),waitTime=0)
            # 发送
            wx.SendKeys('{Enter}',waitTime=0)
            # 通过消息匹配检索会话框的联系人
            # wx.TextControl(SubName=ar[0][:5]).RightClick()
        # 无匹配时
        else:
            wx.SendKeys('不好意思，我没有理解你的意思',waitTime=0)
            wx.SendKeys('{Enter}',waitTime=0)
            # wx.TextControl(SubName=last_msg[:5]).RightClick()
```