// pages/game/game.js
var timer;
var Anumcount = 0,Bnumcount = 0;
var resultpoint;
Page({
  data: {
    img:[
      {
        index:"/images/point1.png"
      },
      {
        index:"/images/point2.png"
      },
      {
        index:"/images/point3.png"
      },
      {
        index:"/images/point4.png"
      },
      {
        index:"/images/point5.png"
      },
      {
        index:"/images/point6.png"
      },
    ],
    index:0,//存储下标
    timer:"",//存储计时器
    timers:true,//防止连续点击，防止抖动
    title:"?",//输出数字
    time : (new Date()).toString(),
    condition : true,
    Atuo: false,
    Btuo: false,
    time : (new Date()).toString(),
    array : 
    [{
          message : 'foo',
        },{
          message : 'bar'
        }],
    ATurn : true,
    BTurn : false,
    num : 1,
    extra : 1,
    Mscore : 0,
    Escore : 0,
    number : null,
    ss : [0,0],
    mp: ['','','','','','','','',''],
    ep: ['','','','','','','','',''],
    p1touziImage : ['','','','','','','','',''],/*九个格子*/
    p2touziImage : ['','','','','','','','',''],/*九个格子*/
    Gameover : false,
    winner : '',
    touziImage: '/images/point3.png',
  },
  li(){
    var rannumber = parseInt(Math.random() * 6)+1//获取随机数，Math.random()获得随机数是[0,1]
    this.setData({
      touziImage: '/images/'+"point"+String(rannumber)+'.png',//根据随机点数更新骰子图片
      num: rannumber
    })
  },
  GO(){
    timer = setInterval(this.li, 10);//设置定时器
    setTimeout(()=>
   {
      clearInterval(timer);//停止定时器
      if(this.data.ATurn == true&&this.data.Atuo == true) this.Aplay();//如果轮到A且托管则执行Aplay()函数
      else if(this.data.BTurn == true&&this.data.Btuo == true) this.Bplay();
      timer = 0;//如果轮到B且托管则执行Bplay()函数
   }, 1200)//投掷1200ms停止
  },
  play(){
    this.GO();
  },
  /*玩家A放置骰子*/
Aset(res){
    console.log(res.currentTarget.dataset);
    if(res.currentTarget.dataset.num == ''&&this.data.ATurn == true&&timer == 0&&this.data.Atuo == false){
      let index = res.currentTarget.dataset.index
      console.log(res.currentTarget.dataset.index);
      let info = `mp[${index}]`
      let infoImage = `p1touziImage[${index}]`
      this.setData({
        [info]: this.data.num,
        [infoImage]: '/images/'+"point"+String(this.data.num)+'.png',
        ATurn : false,
        BTurn : true,
      })
      let x = index;
      while(x - 3 >= 0) x-=3;
      for(let i = 0;i <= 2;i++)
       {
           let xb = `ep[${x+3*i}]`;
           let xbImage = `p2touziImage[${x+3*i}]`
           if(this.data.ep[x+3*i] == this.data.num) this.setData({[xb]: '',[xbImage]: ''}),Bnumcount--;
       }
       Anumcount++;
    if(Anumcount == 9){
      this.CalResult();
    }
    else if(this.data.Btuo == true){
      this.play();
    }
    }
},
/*玩家B放置骰子*/
Bset(res){
  console.log(res.currentTarget.dataset);
  if(res.currentTarget.dataset.num == ''&&this.data.BTurn == true&&timer == 0&&this.data.Btuo == false){
    let index = res.currentTarget.dataset.index
    console.log(res.currentTarget.dataset.index);
    let info = `ep[${index}]`
    let infoImage = `p2touziImage[${index}]`
    this.setData({
      [info]: this.data.num,
      [infoImage]: '/images/'+"point"+String(this.data.num)+'.png',
      ATurn : true,
      BTurn : false,
    })
    let x = index;
    while(x - 3 >= 0) x-=3;
    for(let i = 0;i <= 2;i++)
     {
         let xb = `mp[${x+3*i}]`;
         let xbImage = `p1touziImage[${x+3*i}]`
         console.log(x+3*i)
         console.log(this.data.mp[x+3*i])
         if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Anumcount--;
     }
     Bnumcount++;
  if(Bnumcount == 9){
    this.CalResult();
  }
  else if(this.data.Atuo == true){
    this.play();
  }
  }
},
colScore(data1,data2,data3){
  var colSameCount = [0,0,0,0,0,0,0];
  var tempScore = 0;
    if(data1 != '')
    colSameCount[data1]++;
    if(data2 != '')
    colSameCount[data2]++;
    if(data3 != '')
    colSameCount[data3]++;
    for(var i = 1;i <= 6;i++)
      tempScore += colSameCount[i] * i * colSameCount[i];
    return  tempScore;
},
  //计分并比较得出结果
  CalResult(){
    var MyScore = 0,EnemyScore = 0;
    for(let i = 0;i <= 2;i++)
      MyScore += this.colScore(this.data.mp[i],this.data.mp[i+3],this.data.mp[i+6]);
      for(let i = 0;i <= 2;i++)
    EnemyScore += this.colScore(this.data.ep[i],this.data.ep[i+3],this.data.ep[i+6]);

    if(MyScore > EnemyScore) this.setData({Gameover: true,winner : "玩家A胜利!",Mscore : MyScore,Escore : EnemyScore});
    else if(MyScore < EnemyScore) this.setData({Gameover: true,winner : "玩家B胜利!",Mscore : MyScore,Escore : EnemyScore});
    else this.setData({Gameover: true,winner : "平局",Mscore : MyScore,Escore : EnemyScore});
},
calNowScore(){
  var MyScore = 0,EnemyScore = 0;
  for(let i = 0;i <= 2;i++)
      MyScore += this.colScore(this.data.mp[i],this.data.mp[i+3],this.data.mp[i+6]);
  for(let i = 0;i <= 2;i++)
      EnemyScore += this.colScore(this.data.ep[i],this.data.ep[i+3],this.data.ep[i+6]);
  return [MyScore, EnemyScore];
},
//托管的实现
Atuoguan(){
  if(this.data.Atuo == false&&this.data.ATurn == true)
   {
       this.setData({
        Atuo: true,
       })
       this.play();
    }
    else 
     {
      clearInterval(timer);
      this.setData({
      Atuo: false,
       })
      }
},
Btuoguan(){
  if(this.data.Btuo == false&&this.data.BTurn == true)
   {
       this.setData({
        Btuo: true,
       })
       this.play();
    }
    else 
     {
       clearInterval(timer);
       this.setData({
        Btuo: false,
       })
      }
},
Aplay(){
  let tempPos,tempScore=[],maxScore = -1000,maxPos = 0,tempClear=[];
  for(let i = 0;i <= 2;i++){
     for(let j = 0;j <= 2;j++)
     {
       if(this.data.mp[i+3*j] == ''){
           tempPos = i+3*j;
           let xb = `mp[${i+3*j}]`;
           this.setData({
              [xb]: this.data.num
           });
           let x = tempPos;
           while(x - 3 >= 0) x-=3;
           for(let k = 0;k <= 2;k++)
         {
            let xb2 = `ep[${x+3*i}]`;
            console.log(x+3*i)
            console.log(this.data.ep[x+3*i])
            if(this.data.ep[(x+3*i)] == this.data.num) this.setData({[xb2]: ''}),tempClear.push(xb2);
         }

           tempScore = this.calNowScore();

           this.setData({[xb]: ''});
           for(let k = 0;k < tempClear.length;k++){
             let a = tempClear[k];
             this.setData({[a]: this.data.num});
           }
           break;
       }
     }
     if(tempScore[1] - tempScore[0] > maxScore) {maxPos = tempPos; maxScore = tempScore[1] - tempScore[0];}
  } 
  let xb = `mp[${maxPos}]`;
  let infoImage = `p1touziImage[${maxPos}]`
  this.setData({
      [xb]: this.data.num,
      [infoImage]: '/images/'+"point"+String(this.data.num)+'.png',
      ATurn : false,
      BTurn : true,
  });
  let x = maxPos;
  while(x - 3 >= 0) x-=3;
  for(let i = 0;i <= 2;i++)
   {
       let xb = `ep[${x+3*i}]`;
       let xbImage = `p2touziImage[${x+3*i}]`
       console.log(x+3*i)
       console.log(this.data.ep[x+3*i])
       if(this.data.ep[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Bnumcount--;
   }
   Anumcount++;
   
   if(Anumcount == 9){
      this.CalResult();
   }
   else if(this.data.Btuo == true){
    this.play();
 }
},
Bplay(){
  let tempPos,tempScore=[],maxScore = -1000,maxPos = 0,tempClear=[];
  for(let i = 0;i <= 2;i++){
     for(let j = 0;j <= 2;j++)
     {
       if(this.data.ep[i+3*j] == ''){
           tempPos = i+3*j;
           let xb = `ep[${i+3*j}]`;
           this.setData({
              [xb]: this.data.num
           });
           let x = tempPos;
           while(x - 3 >= 0) x-=3;
           for(let k = 0;k <= 2;k++)
         {
            let xb2 = `mp[${x+3*i}]`;
            console.log(x+3*i)
            console.log(this.data.mp[x+3*i])
            if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb2]: ''}),tempClear.push(xb2);
         }

           tempScore = this.calNowScore();

           this.setData({[xb]: ''});
           for(let k = 0;k < tempClear.length;k++){
             let a = tempClear[k];
             this.setData({[a]: this.data.num});
           }
           break;
       }
     }
     if(tempScore[1] - tempScore[0] > maxScore) {maxPos = tempPos; maxScore = tempScore[1] - tempScore[0];}
  } 
  let xb = `ep[${maxPos}]`;
  let infoImage = `p2touziImage[${maxPos}]`
  this.setData({
      [xb]: this.data.num,
      [infoImage]: '/images/'+"point"+String(this.data.num)+'.png',
      ATurn : true,
      BTurn : false,
  });
  let x = maxPos;
  while(x - 3 >= 0) x-=3;
  for(let i = 0;i <= 2;i++)
   {
       let xb = `mp[${x+3*i}]`;
       let xbImage = `p1touziImage[${x+3*i}]`
       console.log(x+3*i)
       console.log(this.data.mp[x+3*i])
       if(this.data.mp[(x+3*i)] == this.data.num) this.setData({[xb]: '',[xbImage]:''}),Anumcount--;
   }
   Bnumcount++;
   
    if(Bnumcount == 9){
      this.CalResult();
   }
   else if(this.data.Atuo == true){
      this.play();
   }
},

restart(){
  Anumcount = 0,Bnumcount = 0;
  this.setData({
    ATurn : true,
    BTurn : false,
    Atuo: false,
    Btuo: false,
    num : 1,
    Mscore : 0,
    Escore : 0,
    number : null,
    mp: ['','','','','','','','',''],
    ep: ['','','','','','','','',''],
    p1touziImage : ['','','','','','','','',''],
    p2touziImage : ['','','','','','','','',''],
    Gameover : false,
    winner : '',
  })
},
backHome:function(){
  wx.navigateTo({
    url: '/pages/homes/homes',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    /*关闭所有页，打开url指定页面*/
    wx.reLaunch({
      url: '../index/index'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})