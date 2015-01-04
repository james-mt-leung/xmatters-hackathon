(function()
{
    "use strict";
        
  var db = getLocalStorage();
  function getLocalStorage() {
    try {
      if(window.localStorage ) return window.localStorage;            
    }
    catch (e) {
      return undefined;
    }
  }
    
  var defineConstants = function() {
    db.setItem('url', 'https://systest.digitallife.att.com/penguin')
    db.setItem('userId', '553474448');
    db.setItem('password', 'NO-PASSWD');
    db.setItem('domain', 'DL');
    db.setItem('appKey', 'JE_FF3483CC1D221507_1');
  }

  var init = function() {
    $("#unlockDoorButton").hide();
    defineConstants();
    register_event_handlers();
  }
  
  var getDevices = function() {
    $.ajax({
        type: "GET",
        url: db.getItem('url')
             + '/api/' + db.getItem('gatewayGUID')
             + '/devices',
        headers: { 
            'Appkey': db.getItem('appKey'),
            'Authtoken': db.getItem('authToken'),
            'Requesttoken': db.getItem('requestToken')
        },
        success: function(data, textStatus, jqXHR) {
            var devices = data.content;
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].deviceType == 'door-lock') {
                    db.setItem('doorDeviceGuid', devices[i].deviceGuid);
                    $("#unlockDoorButton").show();
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }
    
  var unlockDoor = function(event) {
    $.ajax({
        type: "POST",
        url: db.getItem('url')
             + '/api/' + db.getItem('gatewayGUID')
             + '/devices/' + db.getItem('doorDeviceGuid')
             + '/lock',
        headers: { 
            'Appkey': db.getItem('appKey'),
            'Authtoken': db.getItem('authToken'),
            'Requesttoken': db.getItem('requestToken')
        },
        data: 'unlock',
        dataType: 'text',
        contentType: 'application/json;charset=UTF-8',
        success: function(data, textStatus, jqXHR) {
            alert(JSON.stringify(data));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }
        
  function register_event_handlers()
  {
    $(document).on("click", ".uib_w_1", function(evt)
    {
        $.ajax({
            type: "POST",
            url: db.getItem('url') 
                 + '/api/authtokens?'
                 + 'userId=' + $('#userId').val()
                 + '&password=' + $('#pass').val()
                 + '&domain=' + db.getItem('domain')
                 + '&appKey=' + db.getItem('appKey'),
            success: function(data, textStatus, jqXHR) {
                db.setItem('gatewayGUID', data.content.gateways[0].id)
                db.setItem('authToken', data.content.authToken);
                db.setItem('requestToken', data.content.requestToken);
                $("#status").text("Gateway: " + db.getItem('gatewayGUID'));
                $(".uib_w_1").hide();
                getDevices();
//                $(":mobile-pagecontainer").pagecontainer( "change", "#UnlockDoor", { role: "button" } );
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });

    /* button  #unlockDoorButton */
    $(document).on("click", "#unlockDoorButton", unlockDoor);
  }
  document.addEventListener("app.Ready", init, false);
})();
