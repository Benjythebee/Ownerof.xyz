
import { h, render } from 'preact'
import  MainApp  from './main'


// Google API for page views;
const s = document.createElement('script')
s.async=true
s.src = 'https://www.googletagmanager.com/gtag/js?id='+process.env.GOOGLE_API||''
document.head.insertBefore(s, document.head.firstChild);

;(window as any).dataLayer = (window as any).dataLayer || [];

function gtag(...args:any[]){
    ;(window as any).dataLayer.push(args);
}
gtag('js', new Date());

gtag('config', process.env.GOOGLE_API||'');

render(<MainApp/>, document.body);
