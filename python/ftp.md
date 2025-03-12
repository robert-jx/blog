# 类 xftp 的文件传输工具的实现

因为在工作中经常使用 `xftp` 工具，突发奇想能否自己做一个简单的能够直接一键上传的工具，研究后发现可以使用 `python` 来实现👇

## 思路

首先使用 `os` 来实现文件的操作,`pathlib` 来对文件路径进行处理

同时使用 `zipfile` 来对文件进行压缩操作

然后使用 `paramiko` 来直接使用 SSH 协议对远程服务器执行操作

最后使用 `tkinter` 把所有代码封装成可视化的 GUI 程序

## 代码

```python
import os
import shutil
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import paramiko
from pathlib import Path
import zipfile
import threading
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')


class XFTPUploader:
    def __init__(self, root):
        self.root = root
        root.title("文件传输工具v1.2")
        root.geometry("800x600")

        # 连接配置
        self.host = tk.StringVar(value="")
        self.remote_path = tk.StringVar(value="")
        self.port = tk.IntVar(value=22)
        self.username = tk.StringVar(value="")
        self.password = tk.StringVar(value="")

        # 文件列表存储
        self.file_list = []
        self.tree = None
        self.progress = None

        self.create_widgets()

    def create_widgets(self):
        # 顶部配置面板
        config_frame = ttk.LabelFrame(self.root, text="服务器配置")
        config_frame.pack(pady=5, padx=10, fill=tk.X)

        ttk.Label(config_frame, text="IP:").grid(row=0, column=0, padx=5)
        ttk.Entry(config_frame, textvariable=self.host).grid(row=0, column=1, padx=5)

        ttk.Label(config_frame, text="远程地址:").grid(row=0, column=2, padx=5)
        ttk.Entry(config_frame, textvariable=self.remote_path).grid(row=0, column=3, padx=5)

        ttk.Label(config_frame, text="端口:").grid(row=0, column=4, padx=5)
        ttk.Entry(config_frame, textvariable=self.port, width=8).grid(row=0, column=5, padx=5)

        ttk.Label(config_frame, text="用户名:").grid(row=1, column=0, padx=5)
        ttk.Entry(config_frame, textvariable=self.username).grid(row=1, column=1, padx=5)

        ttk.Label(config_frame, text="密码:").grid(row=1, column=2, padx=5)
        ttk.Entry(config_frame, textvariable=self.password, show="*").grid(row=1, column=3, padx=5)

        # 文件操作面板
        file_ops_frame = ttk.Frame(self.root)
        file_ops_frame.pack(pady=5, fill=tk.X)

        ttk.Button(file_ops_frame, text="添加文件", command=self.add_files).pack(side=tk.LEFT, padx=5)
        ttk.Button(file_ops_frame, text="添加文件夹", command=self.add_folder).pack(side=tk.LEFT, padx=5)
        ttk.Button(file_ops_frame, text="清空列表", command=self.clear_list).pack(side=tk.LEFT, padx=5)

        # 文件列表展示
        self.tree = ttk.Treeview(self.root, columns=("type", "size", "path"), show="headings")
        self.tree.heading("#0", text="名称")
        self.tree.heading("type", text="类型")
        self.tree.heading("size", text="大小")
        self.tree.heading("path", text="本地路径")
        self.tree.column("#0", width=200)
        self.tree.column("type", width=80)
        self.tree.column("size", width=100)
        self.tree.column("path", width=400)
        self.tree.pack(pady=5, padx=10, fill=tk.BOTH, expand=True)

        # 进度条
        self.progress = ttk.Progressbar(self.root, orient=tk.HORIZONTAL, mode='determinate')
        self.progress.pack(pady=5, padx=10, fill=tk.X)

        # 操作按钮
        ttk.Button(self.root, text="开始上传", command=self.start_upload).pack(pady=10)

    def add_files(self):
        files = filedialog.askopenfilenames(title="选择要上传的文件")
        if files:
            for f in files:
                print('f',f)
                self._add_to_list(Path(f))
            self._update_treeview()

    def add_folder(self):
        folder = filedialog.askdirectory(title="选择要上传的文件夹")
        if folder:
            print('folder',folder)
            print('Path(folder)',Path(folder))
            # self._add_to_list(Path(folder), is_dir=True)
            self._add_to_list(Path(folder), is_dir=True)
            self._update_treeview()

    def _add_to_list(self, path, is_dir=False):
        """添加文件/文件夹到列表并去重"""
        if any(item['path'] == str(path) for item in self.file_list):
            return

        item = {
            "name": path.name,
            "path": str(path),
            "is_dir": is_dir or path.is_dir(),
            "size": self._get_size(path)
        }
        self.file_list.append(item)

    def _get_size(self, path):
        """获取文件/文件夹大小"""
        if path.is_file():
            return f"{path.stat().st_size / 1024:.1f} KB"
        try:
            total = sum(f.stat().st_size for f in path.glob('**/*') if f.is_file())
            return f"{total / 1024:.1f} KB"
        except:
            return "未知"

    def _update_treeview(self):
        """更新文件列表显示"""
        for item in self.tree.get_children():
            self.tree.delete(item)

        for item in self.file_list:
            icon = "📁" if item['is_dir'] else "📄"
            self.tree.insert("", "end",
                             text=f"{icon} {item['name']}",
                             values=(
                                 "文件夹" if item['is_dir'] else "文件",
                                 item['size'],
                                 item['path']
                             )
                             )

    def clear_list(self):
        self.file_list = []
        self._update_treeview()

    def start_upload(self):
        if not self.file_list:
            messagebox.showwarning("警告", "请先选择要上传的内容")
            return

        threading.Thread(target=self.upload_process, daemon=True).start()

    def upload_process(self):
        try:
            # 创建临时目录
            temp_dir = Path("temp_upload")
            temp_dir.mkdir(exist_ok=True)

            # 压缩文件/文件夹
            zip_path = temp_dir / "upload.zip"
            self.compress_files(zip_path)

            # 上传压缩包
            transport = paramiko.Transport((self.host.get(), self.port.get()))
            transport.connect(username=self.username.get(), password=self.password.get())
            sftp = paramiko.SFTPClient.from_transport(transport)

            remote_base = self.remote_path.get()  # 远程基础路径
            print('remote',remote_base)
            remote_zip = f"{remote_base}/upload.zip"

            # 上传压缩包
            self.progress['value'] = 50
            self.root.update_idletasks()
            sftp.put(str(zip_path), remote_zip)

            # 解压压缩包
            self.progress['value'] = 75
            self.root.update_idletasks()
            self.unzip_on_server(sftp, remote_zip, remote_base)

            # 清理远程压缩包
            sftp.remove(remote_zip)

            messagebox.showinfo("完成", "所有内容上传并解压成功！")
        except Exception as e:
            messagebox.showerror("错误", f"上传失败: {str(e)}")
        finally:
            if 'sftp' in locals(): sftp.close()
            if 'transport' in locals(): transport.close()
            self.progress['value'] = 0
            # 清理临时文件
            if temp_dir.exists():
                shutil.rmtree(temp_dir)

    def compress_files(self, zip_path):
        """压缩所有选中的文件/文件夹"""
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for item in self.file_list:
                path = Path(item['path'])
                if item['is_dir']:
                    for root, _, files in os.walk(path):
                        for file in files:
                            file_path = Path(root) / file
                            arcname = file_path.relative_to(path.parent)
                            zipf.write(file_path, arcname)
                else:
                    zipf.write(path, path.name)

    def unzip_on_server(self, sftp, remote_zip, remote_base):
        """在服务器端解压"""
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(
                hostname=self.host.get(),
                port=self.port.get(),
                username=self.username.get(),
                password=self.password.get()
            )

            # 构造解压命令
            unzip_cmd = f"unzip -qo {remote_zip} -d {remote_base}"

            # 执行命令
            stdin, stdout, stderr = ssh.exec_command(unzip_cmd)

            # 检查错误
            exit_status = stdout.channel.recv_exit_status()
            if exit_status != 0:
                error = stderr.read().decode()
                raise Exception(f"解压失败: {error}")
        finally:
            ssh.close()


if __name__ == "__main__":
    root = tk.Tk()
    app = XFTPUploader(root)
    root.mainloop()
```