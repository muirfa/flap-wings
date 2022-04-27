var beep=new Audio();
beep.src="audio/sfx_point.wav"

var hit=new Audio();
hit.src="audio/sfx_hit.wav"

var flap=new Audio();
flap.src="audio/sfx_flap.wav"

var burung1= new Image();
burung1.src="image/char1.png";

var burung2= new Image();
burung2.src="image/char2.png";

var bg= new Image();
bg.src="image/bgfb.jpg";

var judul= new Image();
judul.src="image/judul.png";

var gambarTiang= new Image();
gambarTiang.src="image/pipe.jpg";

var mati= new Image();
mati.src="image/die.png";

function mulaiKanvas(){
    var canvas=document.getElementById('canvas');
    var ctx=canvas.getContext('2d');

    canvas.width=canvas.scrollWidth;
    canvas.height=canvas.scrollHeight;
    
    var cW=canvas.width;
    var cH=canvas.height;
    
    var bgX=0; start=false, z=180;
    function splash() {
        ctx.clearRect(0,0,cW,cH);
        ctx.drawImage(bg,bgX-=2,0);
        if(bgX==-1598){
            bgX=0;
        }
        ctx.font= "Bold 80px arial";
        ctx.fillText("KLIK untuk memulai", 350, 400);

        ctx.drawImage(judul,450,70);

        ctx.drawImage(burung1,650,z+=2);
        if(z>=230){z=180;}
    }
    var inSplash=setInterval(splash,30);

    document.addEventListener('click',function(event) {
        if(start==false){
            start=true;
            clearInterval(inSplash);
            utama();
        }
    });

    function utama() {

        //Background
        var gantiGambar=false;
        function BG(){
            this.x=0;
            this.render=function(){
                ctx.drawImage(bg,this.x--,0);
                
                if(this.x==-1599){
                    this.x=0;
                }
            }
        }

        var latar=new BG();

        //Karakter
        function Karakter() {
            this.x=100;this.y=200; this.w=100, this.h=100,this.i=0;
            this.render=function(){
                if(gantiGambar){
                ctx.drawImage(burung2,this.x,this.y+=5);
                this.i++;
                if(this.i==5){
                    gantiGambar=false;
                    this.i=0;
                }
                }else{
                ctx.drawImage(burung1,this.x,this.y+=5);
                }
            } 
        }
        var karakter=new Karakter();
        
        
        //Tiang
        var tiang=[];
        tambahTiang();
        function tambahTiang() {
            var x=1440, y=0, w=50, h=300;
            var acak=Math.floor(Math.random()*250);
            tiang.push({"x":x,"y":y-acak,"w":w,"h":h});
        }

        var hitung=0;

        function selesai() {
            clearInterval(interval);
            ctx.clearRect(0,0,cW,cH);
            latar.render();
            renderTiang();
            ctx.drawImage(mati,karakter.x,karakter.y);
            
            ctx.font="Bold 60px arial";
            ctx.fillText("Refresh untuk Memulai Kembali", 320,150);
            
            ctx.font="Bold 60px arial";
            ctx.fillText("Point yang diperoleh : "+ skor, 420,250);
            hit.play();
        }

        var skor=0, tambahNilai=true;
        function tambahSkor() {
            skor++;
            beep.play();
        }

        function kena() {
            for(var i = 0;i<tiang.length;i++){
                var t=tiang[i];
                if((karakter.x+karakter.w>t.x && karakter.y<t.y+t.h && karakter.x<t.x+t.w)||(karakter.x+karakter.w>t.x && karakter.y+karakter.h>t.y+t.h+300 && karakter.x<t.x+t.w)){
                    selesai();
                }else if (t.x+t.w<karakter.x) {
                    if (tambahNilai) {
                        tambahSkor();
                        tambahNilai=false;
                    }
                }
            }
            if(karakter.y<=0){selesai();}
            if(karakter.y+karakter.h>cH){selesai();}
            
            
        }

        function renderTiang() {
            for(var i=0;i<tiang.length;i++){
                var t=tiang[i];
                ctx.drawImage(gambarTiang,t.x--,t.y);
                ctx.drawImage(gambarTiang,t.x--,t.y+t.h+300);

                if(t.x+t.w<0){
                    tiang.splice(i,1);
                    tambahNilai=true;
                }
            }
            hitung++;
            if(hitung==150){
                tambahTiang();
                hitung=0;
            }
        }

        function animasi(){
            ctx.save();
            ctx.clearRect(0,0,cW,cH);
            
            latar.render();
            
            karakter.render();
            renderTiang();
            ctx.font="Normal 30px Arial";
            ctx.fillText("Point : "+skor, 20, 60);
            kena();

            ctx.restore();
        }
        var interval=setInterval(animasi,30);

        ctx.canvas.addEventListener('click',function(event){
            karakter.y-=70
            gantiGambar=true;
            flap.play();
        })

    }//end fungsi utama
}

window.addEventListener('load',function (event) {
    mulaiKanvas()
    
});