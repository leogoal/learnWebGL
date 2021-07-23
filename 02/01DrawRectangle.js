/**
 * 使用canvas绘制2d图形
 */
function main() {
    const canvas = document.getElementById('example');
    if(!canvas) {
        console.log('canvas 元素不存在');
        return;
    }
    
    //获取绘制2d图形的绘图上下文
    const ctx = canvas.getContext('2d'); 

    //设置填充颜色，用字符串来设置
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
    
    ctx.fillRect(120, 10, 150, 150);
}