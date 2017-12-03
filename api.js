/**
 * [Api para obter fotos do instagram do usuario]
 */

/**
 * [hora atual]
 * @param  {[type]} hora [inteiro]
 * @return {[type]}      [date com toISOString()]
 */
var horaAtual = function(hora){
  if(!hora){
    var s = new Date();
  }else{
    var s = new Date();
        s.setHours(s.getHours() + hora);
  }
  return s.toISOString();
}

/**
 * [adicionar objetos em localStorage]
 * @param  {[type]} props [array de objetos]
 */
var setLocalStorage = function(props){
  if (typeof(Storage) !== "undefined") {
      $.each(props, function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
        console.log(key, value)
      })
  }else{
      console.log('localStorage sem suporte.');
  }
}

/**
 * [obter dados do localStorage]
 * @param  {[type]} key [ chave do localStorage]
 * @return {[type]}     [JSON.parse(obj)]
 */
var getLocalStorage = function(key){
        var obj = localStorage.getItem(key);
        return JSON.parse(obj)
}

/**
 * [description]
 * @param  {[type]} e [response api do instagram]
 * @return {[type]}   [li]
 */
var mountInstagram = function(e){
  var o = "";
  for (a = 0; a < 2; a++){
    o += "<li>";
    o += "<a href='https://url.com'>";
    o += "<img src='" + e.data[a].images.standard_resolution.url + "'/>";
    o += "</a></li>";
  }
  $(".list-images").html(o);
}

/**
 * [função para verificar se a key de cache existe ]
 * @return {[boolean]} [true, false]
 */
var checkHourCache = function(){
    var local = getLocalStorage('Instagram_CACHE_API');
    if(!local){
        return false;
    }
    return true;
}

var API_Instagram = (function(){

  var executou = false;
  var cache = checkHourCache();
  //user id
  //token = access_token
  var config = { user: '', token: '' };

  var url = "https://api.instagram.com/v1/users/" + config.user + "/media/recent/?access_token=" + config.token;

  return function(){
    console.log( (!executou && !cache) ? 'exec cache false' : 'exec cache true' );
    if(!executou && !cache){

      console.log('sem cache');

      $.ajax({
          url: url,
          type: "GET",
          dataType: "jsonp",
          cache: !1,
          success: function(e) {
              setLocalStorage({
                Instagram_CACHE_API: {
                  time: horaAtual(4),
                  data: e}
              });
              mountInstagram(e);
              executou = true;
          },
          error: function(e) {
              console.error(e)
          }
      })

    }else{

        var local = getLocalStorage('Instagram_CACHE_API');



        if(horaAtual() > local.time){

          localStorage.removeItem('Instagram_CACHE_API');
          executou = false;
          cache = checkHourCache();
          API_Instagram();

        }else{

          console.log('horaAtual < que ' + local.time);
          mountInstagram(local.data);
          executou = true;

        }


    }

  }
})();
