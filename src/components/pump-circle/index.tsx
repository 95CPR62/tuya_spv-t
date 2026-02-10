import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Input, usePageEvent, createCanvasContext, getSystemInfoSync } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { debounce } from 'lodash-es';

type PumpCircleProps = {
  state?: string
  screenWidth?: number
  centerX?: number
  centerY?: number
  startAngle?: number
  endAngle?: number
  totalAngle?: number
  diameter?: number
  stokeWidth?: number
  canvasValue?: number
  radius?: number
  innerCircleColor?: string 
  innerCircleWidth?: string
  outerCircleColor?: string
  customStyle?: React.CSSProperties
  setCanvasValue?: (value: number) => void
  startValue?: number
  endValue?: number
  step?: number
  value?: number
  // className?: string
  // value: string
  // type?: string // text, number, idcard, digit
  // confirmBtn?: string // search, done, send, next, go
  // editable?: boolean
  // styleType?: string
  // onInput?: (value: string) => void
  // onTapBg?: (value: string) => void
  // onConfirm?: (value: string) => void
} ;

export const PumpCircle = (props: PumpCircleProps) => {
  const [o_screenWidth] = useState(getSystemInfoSync().screenWidth - (getSystemInfoSync().screenWidth*0.28));  
  const [o_centerX, setOCenterX] = useState(o_screenWidth  / 2);       // 圆心X轴坐标
     const [o_centerY, setOCenterY] = useState(o_screenWidth  / 2) ;        // 圆心Y轴坐标
    //  console.log('screenWidth---', screenWidth, centerX, centerY)
     const [o_startAngle, setOStartAngle] = useState((3 * Math.PI) / 4);       // 开始角度
     const [o_endAngle, setOEndAngle] = useState(Math.PI / 4 );        // 结束角度
     const [o_totalAngle, setOTotalAngle] = useState((3 * Math.PI) / 2);       // 总的绘图角度  
    //  const [o_startAngle, setOStartAngle] = useState(Math.PI * 0.65);       // 开始角度
    //  const [o_endAngle, setOEndAngle] = useState((Math.PI *2.35) );        // 结束角度
    //  const [o_totalAngle, setOTotalAngle] = useState((Math.PI *2.35) - (Math.PI * 0.65));       // 总的绘图角度 
    //  const [o_totalAngle, setOTotalAngle] = useState((3 * Math.PI) / 2);       // 总的绘图角度  
     const [o_diameter, setODiameter] =  useState(o_screenWidth);       // 直径
     const [o_stokeWidth, setOStokeWidth] =  useState(15);      // 圆弧宽度
     const [o_clientX, setOClientX] = useState(0);          // 画布的X轴位置
     const [o_clientY, setOClientY] = useState(0);          // 画布的Y轴位置
    //  const [o_isTouchMove, setOIsTouchMove] = useState(false);  // 是否可移动滑块
         
    //  const [o_canvasValue, setOCanvasValue] = useState(60);           // 数值
     const [o_radius, setORadius] = useState(o_diameter/2 - o_stokeWidth);  

  const [screenWidth] = useState(getSystemInfoSync().screenWidth - (getSystemInfoSync().screenWidth*0.28) - 50);      
      
    //  console.log('screenWidth---', screenWidth)  
     const [centerX, setCenterX] = useState(screenWidth  / 2);       // 圆心X轴坐标
     const [centerY, setCenterY] = useState(screenWidth  / 2) ;        // 圆心Y轴坐标
    //  console.log('screenWidth---', screenWidth, centerX, centerY)
     const [startAngle, setStartAngle] = useState((3 * Math.PI) / 4);       // 开始角度
     const [endAngle, setEndAngle] = useState(Math.PI / 4 );        // 结束角度
     const [totalAngle, setTotalAngle] = useState((3 * Math.PI) / 2);       // 总的绘图角度  
    //  const [startAngle, setStartAngle] = useState(Math.PI * 0.65);       // 开始角度
    //  const [endAngle, setEndAngle] = useState((Math.PI *2.35) );        // 结束角度
    //  const [totalAngle, setTotalAngle] = useState((3 * Math.PI) / 2);       // 总的绘图角度  
     const [diameter, setDiameter] =  useState(screenWidth);       // 直径
     const [stokeWidth, setStokeWidth] =  useState(15);      // 圆弧宽度
     const [clientX, setClientX] = useState(0);          // 画布的X轴位置
     const [clientY, setClientY] = useState(0);          // 画布的Y轴位置
     const [radius, setRadius] = useState(diameter/2 - stokeWidth);   

     const [isTouchMove, setIsTouchMove] = useState(false);  // 是否可移动滑块
    const totalValue = props.endValue && props.startValue ? (props.endValue - props.startValue)  : 100;
    const step = props.step ? props.step : 1;
    const [canvasValue, setCanvasValue] = useState(props.startValue ? ((props.value - props.startValue) / step) : props.value);           // 数值
       
    // console.log('canvasValue---',canvasValue, props.value, totalValue, step)
  // const [isDisabled, setIsDisabled] = useState(!props.editable ? true : false)
  // const height = isDisabled ? '12vh' : '9vh'

  // function applyStyleCSS() {
  //   return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  // }
  const ctx1 = createCanvasContext('pageCanvas');
    const drawCircle = () => {
 
      // 清除画布--更新画布前需要清除之前的画布内容
      ctx1.clearRect(0, 0, o_screenWidth, o_screenWidth)

    
    // const grd = ctx1.createLinearGradient(0,0,240,0);
    // grd.addColorStop(0, '#0056b3');
    // // grd.addColorStop(0.16, '#3773b1');
    // grd.addColorStop(0.25, '#3773b1');
    // // grd.addColorStop(0.5, '#3773b1');
    // grd.addColorStop(0.5, '#388bb8');
    // grd.addColorStop(0.75, '#3773b1');
    // // grd.addColorStop(0.83, '#7090afff');
    // grd.addColorStop(1, '#0056b3');
    // const { radius, centerX, centerY, startAngle, endAngle, totalAngle } = {
    //   progress: 0, // 初始进度值
    //   radius: 100, // 环形半径
    //   centerX: 150, // canvas中心点X坐标
    //   centerY: 150, // canvas中心点Y坐标
    //   startAngle: -Math.PI / 2, // 开始角度
    //   endAngle: 3 * Math.PI / 2, // 结束角度
    //   totalAngle: Math.PI * 2, // 总角度
    // };
    const lineWidth = 15; // 线宽
    const progressAngle = (canvasValue / (totalValue / step)) * o_totalAngle; // 根据进度计算进度角度
    const endProgressAngle = o_startAngle + progressAngle; // 进度结束角度
    // const outerCirclePath = getArcPath(centerX, centerY, radius, startAngle, endAngle); // 外圆路径
    // const progressPath = getArcPath(centerX, centerY, radius - lineWidth / 2, startAngle, endProgressAngle); // 进度路径
    const handleRadius = 6; // 滑块半径
    // const handleX = centerX + Math.cos(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块X坐标
    // const handleY = centerY + Math.sin(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块Y坐标
    const handleX = o_centerX + Math.cos(endProgressAngle) * (o_radius ); // 滑块X坐标
    const handleY = o_centerY + Math.sin(endProgressAngle) * (o_radius ); // 滑块Y坐标
    const dashLength = 2; // 虚线长度
    const gapLength = 5; // 虚线间隔
    // const handlePath = getArcPath(handleX, handleY, handleRadius, 0, 2 * Math.PI); // 滑块路径
    


     // 绘制半圆环路径
    // ctx.beginPath();
    // ctx.arc(140, 140, radius, startAngle, endAngle); // 绘制半圆弧线

    // ctx.stroke(); // 绘制线条
    
    // 绘制当前进度的虚线弧形（示意用，实际项目中可能需要动态更新）
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, startAngle, endAngle); // 根据进度绘制部分弧线
    //     // 设置线条样式
    // ctx.setLineDash([dashLength, gapLength], 2); // 设置虚线样式
    // ctx.setStrokeStyle('#c9c9c9'); // 线条颜色
    // ctx.setLineWidth(12); // 线条宽度
    // ctx.save(); 
    // ctx.stroke(); // 绘制线条以显示进度
    

    // 绘制外圆和进度条
    // ctx1.beginPath();
    // ctx1.arc(o_centerX , o_centerY, o_radius , o_startAngle, o_endAngle);
    // ctx1.setLineWidth(o_stokeWidth);
    // ctx1.setLineCap('round');
    // ctx1.setStrokeStyle('#ffffff'); // 外圆颜色
    // ctx1.stroke(); // 外圆描边
    
    // ctx1.stroke(); // 外圆描边完成

    
      // console.log('props.state---',props.state)
    // ctx.setStrokeStyle(['#4374f1', '#5ec7c7', '#f9d387', '#f1a88f', '#e78a86']); // 进度条颜色
    if(props.state == 'off' ){
     ctx1.setShadow(0, 0, 10, '#bbbbbb'); // 阴影效果
    }else{
      ctx1.setStrokeStyle(props.state == 'off' ? '#eeeeee' : '#0056b3'); // 进度条颜色
    }
    // ctx.setStrokeGradient(['#4374f1', '#5ec7c7', '#f9d387', '#f1a88f', '#e78a86']);
    ctx1.beginPath();
    ctx1.setLineWidth(o_stokeWidth);
    ctx1.setLineCap('round');
    ctx1.arc(o_centerX, o_centerY, o_radius , o_startAngle, endProgressAngle);
    ctx1.stroke(); // 进度条描边完成

    // 绘制滑块
    ctx1.setFillStyle(props.state ==='off'? '#ffffff' : '#0056b3'); // 滑块填充颜色（可选）
    ctx1.beginPath();
    ctx1.arc(handleX, handleY, handleRadius+1, 0, 2 * Math.PI);
    ctx1.fill(); // 滑块填充完成
    ctx1.setFillStyle('#ffffff'); // 滑块填充颜色（可选）
    ctx1.beginPath();
    ctx1.arc(handleX, handleY, handleRadius, 0, 2 * Math.PI);
    ctx1.fill(); // 滑块填充完成

   
    ctx1.draw(); // 绘制完成，渲染到canvas上*/
  }

  const drawCircle2 = () => {
   const ctx2 = createCanvasContext('pageCanvas2');
        // 清除画布--更新画布前需要清除之前的画布内容
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      
     
      const lineWidth = 15; // 线宽
      const progressAngle = (canvasValue / (totalValue / step)) * totalAngle; // 根据进度计算进度角度
      const endProgressAngle = startAngle + progressAngle; // 进度结束角度
      // const outerCirclePath = getArcPath(centerX, centerY, radius, startAngle, endAngle); // 外圆路径
      // const progressPath = getArcPath(centerX, centerY, radius - lineWidth / 2, startAngle, endProgressAngle); // 进度路径
      const handleRadius = 8; // 滑块半径
      // const handleX = centerX + Math.cos(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块X坐标
      // const handleY = centerY + Math.sin(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块Y坐标
      const handleX = centerX + Math.cos(endProgressAngle) * (radius - 23); // 滑块X坐标
      const handleY = centerY + Math.sin(endProgressAngle) * (radius - 23); // 滑块Y坐标
      const dashLength = 2; // 虚线长度
      const gapLength = 5; // 虚线间隔
      // const handlePath = getArcPath(handleX, handleY, handleRadius, 0, 2 * Math.PI); // 滑块路径
      
  
      
      // 绘制当前进度的虚线弧形（示意用，实际项目中可能需要动态更新）
      ctx2.beginPath();
      ctx2.arc(centerX, centerY, radius, startAngle, endAngle); // 根据进度绘制部分弧线
          // 设置线条样式
      ctx2.setLineDash([dashLength, gapLength], 2); // 设置虚线样式
      ctx2.setStrokeStyle(props.innerCircleColor ? props.innerCircleColor : '#c9c9c9'); // 线条颜色
      ctx2.setLineWidth(props.innerCircleWidth ? props.innerCircleWidth : 12); // 线条宽度
      ctx2.save(); 
      ctx2.stroke(); // 绘制线条以显示进度
      
  
     
      ctx2.draw(); // 绘制完成，渲染到canvas上
    }

    const drawCircle3 = () => {
      const ctx3 = createCanvasContext('pageCanvas3');
        // 清除画布--更新画布前需要清除之前的画布内容
        ctx3.clearRect(0, 0, o_screenWidth, o_screenWidth)

      const lineWidth = 15; // 线宽
      const progressAngle = (canvasValue / (totalValue / step)) * o_totalAngle; // 根据进度计算进度角度
      const endProgressAngle = o_startAngle + progressAngle; // 进度结束角度
      // const outerCirclePath = getArcPath(centerX, centerY, radius, startAngle, endAngle); // 外圆路径
      // const progressPath = getArcPath(centerX, centerY, radius - lineWidth / 2, startAngle, endProgressAngle); // 进度路径
      const handleRadius = 6; // 滑块半径
      // const handleX = centerX + Math.cos(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块X坐标
      // const handleY = centerY + Math.sin(endProgressAngle) * (radius - lineWidth / 2 - handleRadius); // 滑块Y坐标
      const handleX = o_centerX + Math.cos(endProgressAngle) * (o_radius ); // 滑块X坐标
      const handleY = o_centerY + Math.sin(endProgressAngle) * (o_radius ); // 滑块Y坐标
      
      // 绘制外圆和进度条
      ctx3.beginPath();
      ctx3.arc(o_centerX , o_centerY, o_radius , o_startAngle, o_endAngle);
      ctx3.setLineWidth(o_stokeWidth);
      ctx3.setLineCap('round');
      ctx3.setStrokeStyle('#ffffff'); // 外圆颜色
      ctx3.stroke(); // 外圆描边
      
      ctx3.draw(); // 绘制完成，渲染到canvas上*/
    }

     const handleStart = (e) => {
    // console.warn('handleStart', e);
    // e.preventDefault()
    // setClientX(e.touches[0].x);
    // setClientY(e.touches[0].Y);
    setIsTouchMove(true);
    // setValue(v);
  };
  
  const handleMove = useCallback(debounce(e => {
    // console.warn('handleMove', e);
    // const query = createSelectorQuery();
    // query.select('#pageCanvas2').boundingClientRect(function(rect){
    //   // rect 是一个对象，里面包含了节点的相关信息
    //   // console.log('rect',rect);
    //    setClientX(rect.top);
    //   setClientY(rect.left);
      // setIsTouchMove(true);
      if(setIsTouchMove){
        changeValue(e.touches[0], 2)
      }
      
    // }).exec();
   
    // setValue(v);
    
    })
  );
 
  
  const handleEnd = (e) => {
    console.warn('handleEnd');
    // setIsTouchMove(false);
    setTimeout(() => { 
      if(setIsTouchMove){
      changeValue(e.changedTouches[0], 3)
      setIsTouchMove(false);
      }
    }, 500);
  };

  function changeValue(touch, type) {
    // console.warn('touch---',touch)
    // return
    const x = Math.round(touch.x - o_clientX - o_centerX )
    const y = Math.round(touch.y - o_clientY - o_centerY )
    // 使用atan2得到弧度值，范围是[-π, π]
    let radian = Math.atan2(y, x);
    if (radian < 0) {
      // 调整角度到[0, 2π)范围
      radian += 2 * Math.PI
    } else if(radian < 0.5*Math.PI){
      // 第四象限
      radian = Math.abs(radian) + 2 * Math.PI
    }
    // console.log('radian---',radian, o_startAngle, o_endAngle)
    if(radian < o_startAngle-0.2 && radian > o_endAngle+0.2){
      // console.log('---out of range---不在弧形区域')
      // 不在弧形区域
      setIsTouchMove(false);
    } else {
      if(!isTouchMove) return
      const progress = Number(Number(((radian - o_startAngle)/o_totalAngle) * 2.6).toFixed(2)) 
      // this.value = Math.min(100,Math.max(0,Math.round(progress*100)))
      setCanvasValue(Math.min((totalValue / step),Math.max(0,Math.round(progress * 100))))
      props.setCanvasValue(Math.min((totalValue / step),Math.max(0,Math.round(progress * 100))) * step + (props.startValue ? props.startValue : 0), type)
     
      // console.log('radian---', radian,progress,o_startAngle, o_totalAngle, Math.min((totalValue / step),Math.max(0,Math.round(progress*100))))
      // ctx.clearRect(0, 0, diameter, diameter)
      
      
    }
  
  }

  useEffect(() => {
    // console.log('9999', props.value)
    drawCircle()
  }, [canvasValue, props.state])

  useEffect(() => {
    console.log('99998', props.value)
    setCanvasValue(props.value > 0 ? ((props.value - props.startValue) / step) : 0)
    // drawCircle()
  }, [ props.value])
  
    usePageEvent('onReady', () => {
        // console.log('>>>>> onReady',screenWidth,centerX,centerY);
        // const cs = new Render(ctx);
        // console.log(cs)
        // cs.pageDraw({
        //   centerX: centerX,
        //   centerY: centerY,
        //   radius: radius
        // })
       drawCircle();
       drawCircle2(); // 虚线圆
       drawCircle3(); // 虚线圆
    
      })

  return (
    // <View className={`${styles.contentFlexCol} ${props.className} ${applyStyleCSS()}`} style={{ alignItems: 'center' }}>
    <View style={props.customStyle}>
      
      <canvas  className={styles.pumpCanvas} style={{width: `${screenWidth}px`, height: `${screenWidth}px`}} canvas-id="pageCanvas2" 
                    type="2d"
                    disable-scroll="true"
                  ></canvas>
      <canvas className={styles.pumpCanvas} style={{width: `${o_screenWidth}px`, height: `${o_screenWidth}px`}} canvas-id="pageCanvas3" 
        type="2d"
        disable-scroll="true"
      ></canvas>
      <canvas className={styles.pumpCanvas} style={{width: `${o_screenWidth}px`, height: `${o_screenWidth}px`}} canvas-id="pageCanvas" 
        type="2d"
        disable-scroll="true"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      ></canvas>
    </View>
  );
};
