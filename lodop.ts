/*
    Description: 根据lodop官网js翻译为ts
    Use: 通用
 */
interface Clodop extends HTMLElement {
    CVERSION: string;
    VERSION: string;
    SET_LICENSES: (a: string, b: string, c: string, d: string) => void;
    PRINT_INIT: (a: string) => void;
    SET_PRINT_STYLEA: (a: number, b: string, c: number) => void;
    ADD_PRINT_IMAGE: (a: number, b: number, c: string | number, d: string | number, e: string) => void;
    SET_PRINT_COPIES: (num: number) => void;
    PRINT: () => void;
    PREVIEW: () => void;
    src: string;
}
interface DocumentDto extends Document {
    createElement: (str: string) => Clodop;
}
declare const CLODOP: Clodop
declare const getCLodop: () => Clodop
declare const document: DocumentDto

let CreatedOKLodop7766: Clodop | null = null,
    CLodopIsLocal: boolean

// ====判断是否需要 Web打印服务CLodop:===
// ===(不支持插件的浏览器版本需要用它)===
function needCLodop() {
    try {
        const ua = navigator.userAgent
        if (ua.match(/Windows\sPhone/i))
            return true
        if (ua.match(/iPhone|iPod|iPad/i))
            return true
        if (ua.match(/Android/i))
            return true
        if (ua.match(/Edge\D?\d+/i))
            return true

        const verTrident = ua.match(/Trident\D?\d+/i)
        const verIE = ua.match(/MSIE\D?\d+/i)
        let verOPR = ua.match(/OPR\D?\d+/i)
        let verFF = ua.match(/Firefox\D?\d+/i)
        const x64 = ua.match(/x64/i)
        if ((!verTrident) && (!verIE) && (x64))
            return true
        else if (verFF) {
            verFF = verFF[0].match(/\d+/)
            if ((Number(verFF ? verFF[0] : 0) >= 41) || (x64))
                return true
        } else if (verOPR) {
            verOPR = verOPR[0].match(/\d+/)
            if (Number(verOPR ? verOPR[0] : 0) >= 32)
                return true
        } else if ((!verTrident) && (!verIE)) {
            let verChrome = ua.match(/Chrome\D?\d+/i)
            if (verChrome) {
                verChrome = verChrome[0].match(/\d+/)
                if (Number(verChrome ? verChrome[0] : 0) >= 41)
                    return true
            }
        }
        return false
    } catch (err) {
        return true
    }
}

// ====页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
    const src1 = 'http://localhost:8000/CLodopfuncs.js?priority=1'
    const src2 = 'http://localhost:18000/CLodopfuncs.js?priority=0'

    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
    let oscript = document.createElement('script')
    oscript.src = src1
    head.insertBefore(oscript, head.firstChild)
    oscript = document.createElement('script')
    oscript.src = src2
    head.insertBefore(oscript, head.firstChild)
    CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i))
}

// ====获取LODOP对象的主过程：====
export function getLodop(oOBJECT?: Clodop, oEMBED?: Clodop) {
    const strHtmInstall = '<br><font color="#FF00FF">打印控件未安装!点击这里<a href="install_lodop32.zip" target="_self">执行安装</a>,安装后请刷新页面或重新进入。</font>'
    const strHtmUpdate = '<br><font color="#FF00FF">打印控件需要升级!点击这里<a href="install_lodop32.zip" target="_self">执行升级</a>,升级后请重新进入。</font>'
    const strHtm64Install = '<br><font color="#FF00FF">打印控件未安装!点击这里<a href="install_lodop64.zip" target="_self">执行安装</a>,安装后请刷新页面或重新进入。</font>'
    const strHtm64Update = '<br><font color="#FF00FF">打印控件需要升级!点击这里<a href="install_lodop64.zip" target="_self">执行升级</a>,升级后请重新进入。</font>'
    const strHtmFireFox = '<br><br><font color="#FF00FF">（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>'
    const strHtmChrome = '<br><br><font color="#FF00FF">(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>'
    const strCLodopInstall1 = '<br><font color="#FF00FF">Web打印服务CLodop未安装启动，点击这里<a href="CLodop_Setup_for_Win32NT.zip" target="_self">下载执行安装</a>'
    const strCLodopInstall2 = '<br>（若此前已安装过，可<a href="CLodop.protocol:setup" target="_self">点这里直接再次启动</a>）'
    const strCLodopInstall3 = '，成功后请刷新本页面。</font>'
    const strCLodopUpdate = '<br><font color="#FF00FF">Web打印服务CLodop需升级!点击这里<a href="CLodop_Setup_for_Win32NT.zip" target="_self">执行升级</a>,升级后请刷新页面。</font>'
    let LODOP
    try {
        const ua = navigator.userAgent
        const isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i))
        const is64IE = isIE && !!(ua.match(/x64/i))
        if (needCLodop()) {
            try {
                LODOP = getCLodop() // eslint-disable-line
            } catch (err) {
                console.log(err)
            }
            if (!LODOP && document.readyState !== 'complete') {
                alert('网页还没下载完毕，请稍等一下再操作.')
                return
            }
            if (!LODOP) {
                document.body.innerHTML = strCLodopInstall1 + (CLodopIsLocal ? strCLodopInstall2 : '') + strCLodopInstall3 + document.body.innerHTML
                return
            } else {
                if (CLODOP.CVERSION < '3.0.6.0') { // eslint-disable-line
                    document.body.innerHTML = strCLodopUpdate + document.body.innerHTML
                }
                if (oEMBED && oEMBED.parentNode)
                    oEMBED.parentNode.removeChild(oEMBED)
                if (oOBJECT && oOBJECT.parentNode)
                    oOBJECT.parentNode.removeChild(oOBJECT)
            }
        } else {
            // =====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT || oEMBED) {
                if (isIE)
                    LODOP = oOBJECT
                else
                    LODOP = oEMBED
            } else if (!CreatedOKLodop7766) {
                LODOP = document.createElement('object')
                LODOP.setAttribute('width', '0')
                LODOP.setAttribute('height', '0')
                LODOP.setAttribute('style', 'position:absoluteleft:0pxtop:-100pxwidth:0pxheight:0px')
                if (isIE)
                    LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA')
                else
                    LODOP.setAttribute('type', 'application/x-print-lodop')
                document.documentElement.appendChild(LODOP)
                CreatedOKLodop7766 = LODOP
            } else
                LODOP = CreatedOKLodop7766
            // =====Lodop插件未安装时提示下载地址:==========
            if ((!LODOP) || (!LODOP.VERSION)) {
                if (ua.indexOf('Chrome') >= 0)
                    document.body.innerHTML = strHtmChrome + document.body.innerHTML
                if (ua.indexOf('Firefox') >= 0)
                    document.body.innerHTML = strHtmFireFox + document.body.innerHTML
                document.body.innerHTML = (is64IE ? strHtm64Install : strHtmInstall) + document.body.innerHTML
                return LODOP
            }
        }
        if (LODOP.VERSION < '6.2.2.4') {
            if (!needCLodop())
                document.body.innerHTML = (is64IE ? strHtm64Update : strHtmUpdate) + document.body.innerHTML
            return LODOP
        }
        // ===如下空白位置适合调用统一功能(如注册语句、语言选择等):==


        LODOP.SET_LICENSES('', '13528A153BAEE3A0254B9507DCDE2839', '', '')
        // =======================================================
        return LODOP
    } catch (err) {
        alert('getLodop出错:' + err)
    }
}