import { Parser  } from '@json2csv/plainjs';

export const useExportCsv = () => {
    
    const handleDownloadCsv = async (opts: any, data: any[]) => {
        const _opts = { fields: opts };
        const parser = new Parser(_opts);
        console.log('导出 = ', opts, data);
        
        const csv = parser.parse(data);
        // const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
        const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `载荷控制系统log-${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }

    return {
        handleDownloadCsv 
    }
}