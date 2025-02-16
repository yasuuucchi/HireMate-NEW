from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
import os

def create_resume_pdf():
    # テキストファイルを読み込む
    with open('resume.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # PDFを作成
    c = canvas.Canvas('resume.pdf', pagesize=A4)
    c.setFont('Helvetica', 10)
    
    # テキストを描画
    y = 800  # 開始位置
    for line in content.split('\n'):
        if line.strip():
            c.drawString(50, y, line)
        y -= 12  # 行間
        if y < 50:  # ページの下端に近づいたら
            c.showPage()  # 新しいページを作成
            y = 800
            c.setFont('Helvetica', 10)
    
    c.save()

if __name__ == '__main__':
    # カレントディレクトリをスクリプトのディレクトリに変更
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    create_resume_pdf()
