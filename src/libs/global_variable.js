
let global_variable={}

var aq=['陕ICP备20004933号-1','陕ICP备16001387号-1']
module.exports = {
  getAQByAddress(){
      var host=window.location.host;
      console.log(host);
      if(host.indexOf('u-connection.com')!=-1){
        return aq[0];
      }else{
        return aq[1];
      }
    },
};
