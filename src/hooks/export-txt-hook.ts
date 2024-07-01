export const useExportTxtLog = () => {
    
    const handleDownloadTxt = async (data: any) => {
        // const parser = new Parser();
        // const csv = parser.parse(data);
        // const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
        const url = window.URL.createObjectURL(new Blob([data], { type: 'text/plain;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `载荷控制系统log-${new Date().getTime()}.txt`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }

    return {
        handleDownloadTxt 
    }
}