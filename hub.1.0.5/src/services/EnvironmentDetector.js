
module.exports = {
	ReturnIsSPO: () => window.location.hostname.indexOf('sharepoint') > -1,
	ReturnIsHCScreen: () => window.location.pathname.toLowerCase() === '' || window.location.pathname.toLowerCase() === '/' || window.location.pathname.toLowerCase() === '/sitepages/app.aspx' || window.location.pathname.toLowerCase() === '/sites/-dev-hc/sitepages/app.aspx' || window.location.pathname.toLowerCase() === '/sites/-stage-hc/sitepages/app.aspx' || window.location.hostname.indexOf('192') > -1,
};
