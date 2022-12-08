var SelectedQuibId;
var TempComposeTime;
var ComposeQuibTime = null;
var TempTotalTicks;
var setmovietime;
var openmystream;
var resizemystream;
var Rheight2;
var selectedStreams = "";
var imageString;

//Validate User is guest or loggedin
function ValidateUserSession() {
    var deferred = $.Deferred();
    $('#liLogin').css('display', 'none');
    $('#liAvtrLogo').css('display', '');
    if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {
        IsUserAuthenticated().then(function (res) {

            if (!res) {
                $('#liLogin').css('display', '');
                $('#liAvtrLogo').css('display', 'none');
                $('#CloseStream').click();
            }
            deferred.resolve(res);
        });
    }
    else {
        $('#liLogin').css('display', '');
        $('#liAvtrLogo').css('display', 'none');
        $('#CloseStream').click();
        deferred.resolve(false);
    }
    return deferred.promise();
}

//Trigger click event of file-upload control
function uploadImage() {
    $("#image").attr('src', '');
    $("#inputImage").trigger("click");
}

//Function to be called either after Image upload finish or cancel the image upload
function cancelUploadImage() {
    $('#divImage, #imgCancel').hide();
    $('#imgUpload').show();
    $('#inputImage').prop('value', null);
    $('#inputImage').val(null);
    $('#image').attr('src', '');
    $('#txtComposeQuib').prop('readonly', false);
    UpdateComposeTime($('#movieTimer').val());
}

// Setting thumb image source on avatar change
function readURL(input) {
    if (input.files && input.files[0]) {
        if (input.files[0].name.split('.').pop().toLowerCase() == 'jpeg' || input.files[0].name.split('.').pop().toLowerCase() == 'jpg' || input.files[0].name.split('.').pop().toLowerCase() == 'gif' || input.files[0].name.split('.').pop().toLowerCase() == 'png') {
            if (input.files[0].size <= 524288) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    imageString = e.target.result.replace(/^data:image\/(png|jpeg);base64,/, "");
                    //imageString = e.target.result;
                    $('#image').attr('src', e.target.result);
                    $('#imgUpload').hide();
                    $('#divImage, #imgCancel').show();
                    $('#BtnSave').html('Save');
                    $('#txtComposeQuib').prop('readonly', true);
                    if (ComposeQuibTime == null || ComposeQuibTime == undefined)
                        ComposeQuibTime = $('#movieTimer').val();
                }
                reader.readAsDataURL(input.files[0]);
            }
            else {
                $('#large-image-modal').modal('show');
            }
        }
        else {
            $('#select-image-modal').modal('show');
        }
    }
}

$(document).ready(function () {

    if (localStorage.getItem('imgPlayStreamQSClicked') != undefined && localStorage.getItem('imgPlayStreamQSClicked') != null && localStorage.getItem('imgPlayStreamQSClicked').toString().toLowerCase() == "true") {
        localStorage.setItem("imgPlayStreamQSClicked", false);
        $('.popup_load').css('display', 'block');
        $('#quibContainer').empty();
        isRunning = false;
        showLoadingGIF().then(function () {
            setTimeout(function () {
                $(".btnPlay").trigger('click');
            }, 1000);
        });
    }

    if (localStorage.getItem('selectedStreams') != null && localStorage.getItem('selectedStreams') != undefined && localStorage.getItem('environment').length > 0) {
        selectedStreams = localStorage.getItem('selectedStreams');
    }
    localStorage.removeItem('selectedStreams');
    ValidateUserSession();

    resizemystream = true;

    //TO hide jumbled quibs in quib zero 

    $('#quibContainer').css('visibility', 'visible');

    ////for text oreserve in mystream
    //$('#quibContainer').click(function (e) {
    //    $("#txtComposeQuib").focus();
    //});

    // to hide popup when click outside
    $(document).mouseup(function (e) {
        var container = $("#rating-quib");
        var ddlContainer = $('.drop-down-icon');

        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length == 0) // ... nor a descendant of the container
        {
            container.hide();
        }
        if (!ddlContainer.is(e.target) // if the target of the click isn't the container...
            && ddlContainer.has(e.target).length == 0) // ... nor a descendant of the container
        {
            ddlContainer.hide();
        }

    });

    // Draw timeline according to movie length and put pipes for all quibs
    drawTimeLine();

    // By default quib zeros will open on this page
    IsQuibZeroOpen = true;

    // Update timeline and timer control ui for quib zero
    // parameter: IsQuibZero?
    UpdateUIControls(true);

    // Redirecting to community page on header avatar click
    $('#ImgAvtrLogo').on("click", function (e) {

        if (localStorage.getItem('UserId') == '30') {
            $('#register-modal').modal('show');
        }
        else {
            if ($('.my-stream-panel').is(':hidden')) {
                e.preventDefault();
                window.location.href = localStorage.getItem('environment') + "Profile?userId=" + localStorage.getItem('UserId');
            }
            else {
                if ($('#txtComposeQuib').val().length > 0) {
                    $('#save-quib-modal').modal('show');
                }
                else {
                    e.preventDefault();
                    window.location.href = localStorage.getItem('environment') + "Profile?userId=" + localStorage.getItem('UserId');
                }
            }
        }
    });

    // Save rating/tags
    $('#btnDone').on('click', function () {

        var selected = [];
        $('#divTags input:checked').each(function () {
            selected.push($(this).attr('id'));
        });

        if (SelectedQuibId != null) {
            // Add tags in database
            AddUpdateTagMap(SelectedQuibId, selected);
            $('#rating-quib').hide();
        }
    });

    // MY STREAM - Compose quib button click - opening my stream panel
    $('#btn-composequib').on('click', function () {
        ValidateUserSession().then(function (res) {
            if (res) {
                $('#txtComposeQuib').focus();
                setmovietimer = $('#movieTimer').val();
                showLoadingGIF().then(function () {
                    UpdateComposeTime($('#movieTimer').val());
                    //SetQuibInterval();

                    setTimeout(function () {
                        OpenMyStream();
                    }, 100);
                });
            } else {
                $('#guest-login-modal').modal('show');
            }
        });
    });

    // Open My Stream
    $('#movieTimer').on('click', function () {

        resizemystream = false;
        ComposeQuibTime = $('#movieTimer').val();
        if (!openmystream) {
            $('#txtComposeQuib').focus();
            if ($('#txtComposeQuib').val().length > 0) {
                $('#save-quib-modal').modal('show');
            }
            else {
                ValidateUserSession().then(function (res) {
                    if (res) {
                        setmovietimer = ComposeQuibTime;
                        UpdateComposeTime(ComposeQuibTime);

                        //if (isRunning) {
                        //    SetQuibInterval();
                        //}

                        if ($('.my-stream-panel').is(':hidden')) {
                            OpenMyStream();
                        }
                    }
                    else {
                        $('#guest-login-modal').modal('show');
                    }
                });
            }
        }
    });

    // Key press in compose quib area
    $('#txtComposeQuib').on('input propertychange paste', function () {
        ValidateUserSession().then(function (res) {
            if (res) {

                if ($("#txtComposeQuib").val().trim().length > 0) {

                    if (ComposeQuibTime == null || ComposeQuibTime == undefined || ComposeQuibTime.length == 0)
                        ComposeQuibTime = $('#movieTimer').val();

                    $('#BtnSave').html('Save');
                    $('#CloseStream, #btnUploadImage').hide();

                    if (setbool) {
                        var Rheight = $('.mystream-panel-content').height();
                        Rheight = Rheight - 104;
                        $('.mystream-panel-content').css('height', parseInt(Rheight));

                        $('.my-stream-compose').css('height', '160px');

                        setbool = false;
                    }
                }
                else {
                    if (!setbool) {
                        var Rheight = $('.mystream-panel-content').height();
                        $('.my-stream-compose').css('height', '52px');
                        Rheight = Rheight + 108;
                        $('.mystream-panel-content').css('height', Rheight);
                        UpdateComposeTime($('#movieTimer').val());
                        $('#CloseStream, #btnUploadImage').show();
                        $('#BtnSave').html(setmovietimer);
                        cancelUploadImage();
                        setbool = true;
                    }
                    ComposeQuibTime = null;
                }
                $('#txtComposeQuib').focus();
            }
            else {
                $('#guest-login-modal').modal('show');
            }
        });
    });

    // Close my stream panel
    $('#CloseStream').on('click', function () {

        resizemystream = true;
        openmystream = false;
        if (!setbool) {
            //var Rheight = 'calc(100% - 87px)';
            var Rheight = $('.mystream-panel-content').height();
            $('.my-stream-compose').css('height', '52px');
            Rheight = Rheight + 106 + 4; // Mysterious height gap of 4 pxs :'(
            $('.mystream-panel-content').css('height', parseInt(Rheight));
        }
        $('.my-stream-panel').fadeOut();
        cancelUploadImage();
        setbool = true;
    });

    // By default hiding quib timer (remaining time)
    $('#quibTimer').hide();

    // Show quib time in quib box in correct format
    $('.quib-compose-timer').formatTime();

    // Set movie thumbnail on left top corner
    $('.myStreamQuibTime').formatTime();

    // Show movie poster thumbnail in left top corner
    SetMovieThumbnail();

    // Set user avatar in header
    SetUserAvatar();

    // slide function
    function goToByScroll(scroollvalue) {
        $('.mystream-panel-content').scrollTop(0);
        $('.mystream-panel-content').animate({
            scrollTop: $(scroollvalue).offset().top - 200
        }, 'slow');
    }

    // slide function 2
    function goToByScrollState1(scroollvalue) {
        $('.mystream-panel-content').scrollTop(0);
        var temp = $(scroollvalue).offset();
        if (temp != undefined) {
            $('.mystream-panel-content').animate({
                scrollTop: temp.top - 100
            }, 'slow');
        }
    }

    // Save quib from quib comose aream
    $('#BtnSave').on('click', function () {

        ValidateUserSession().then(function (res) {
            if (res) {

                // Cant save blank quib
                if ($("#txtComposeQuib").val().trim().length > 0 || $('#image').attr('src').length > 0) {
                    AddQuib().then(function (QuibId) {

                        goToByScroll($("input[value=" + QuibId + "][class='quibId']").parents('.mystream-wrapper'));
                        $('#txtComposeQuib').val('');
                        $('#txtComposeQuib').focus();
                        cancelUploadImage();
                    });
                }

                if (!setbool) {
                    //var Rheight = 'calc(100% - 87px)';
                    var Rheight = $('.mystream-panel-content').height();
                    $('.my-stream-compose').css('height', '52px');
                    Rheight = Rheight + 108;
                    $('.mystream-panel-content').css('height', Rheight);
                    $('#CloseStream, #btnUploadImage').show();
                }

                UpdateComposeTime($('#movieTimer').val());
                $('#CloseStream, #btnUploadImage').show();
                IsIntervalTimeUP = false;
                setbool = true;

                $('#txtComposeQuib').val('');
                $('#txtComposeQuib').focus();
                ComposeQuibTime = null;
            } else {
                $('#guest-login-modal').modal('show');
            }
        });


    });

    //MY STREAM - Post all quibs
    $('#btnPostAll').on('click', function () {
        var quibId = null;
        var quibBody = null;

        // Calling ajax post call for each quib in my stream
        $('.unposted-quibs').parents('.mystream-wrapper').each(function () {
            quibId = $(this).find('.quibId').val();
            quibBody = $(this).find('.unposted-quibs').val();
            if (quibBody == undefined || quibBody == null || quibBody.length == 0)
                quibBody = $('#img' + quibId).attr('src');
            if (typeof (quibBody) != 'undefined') {
                //if (!IsQuibZeroOpen)
                //    $(".btnPlay").trigger('click');
                UpdateQuibPostedDate(quibId, quibBody);
            }
        });

        $('#postall-quib-modal').modal('hide');
        // Refreshing my stream 
        //GetQuibByUserIdAndMovieId();

    });

    $('#btnChooseStream').on('click', function () {
        if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {
            window.location.href = localStorage.getItem('environment') + "ChooseStream?MovieId=" + queryStringValuefromKey('MovieId');
        }
        else {
            $('#guest-login-modal').modal('show');
        }
    });

    // On click on movie poster go to Choose Movie page
    $('.MoviePosterThumb').on('click', function () {
        if ($('.my-stream-panel').is(':hidden')) {
            window.location.href = localStorage.getItem('environment') + "ChooseMovie";
        }
        else {
            if ($('#txtComposeQuib').val().length > 0) {
                $('#save-quib-modal').modal('show');
            }
        }
    });

    // Getting all quibs
    initialQuibs = GetInitialQuibsQuibStream();
    quibs = GetAllQuibsQuibStream();
    //quibs = GetQuibsByMovieIdForInterval(0);

    $('.unposted-quibs').on('change', function () {
        $.ajax({
            //async: false,
            url: localStorage.getItem('environment') + 'QuibStream/GetQuibByUserIdAndMovieId',
            type: 'POST',
            dataType: 'text',
            success: function (response) {
                if (response != undefined && response != null) {
                    content = response;
                    LoadAllQuibsMyStream(response);
                }
                else {
                    alert("Can't complete action at this time. Please try again later.");
                }
            }
        });
    });

    $('#btnOKBumpDlg').on('click', function () {
        // Add bumpmap
        AddBump($('#BumpQuibId').val(), queryStringValuefromKey("movieId"));

        $('#myStreamPanel').scrollTop(0);
        // Setting save button text to timer value
        if (ComposeQuibTime != null && ComposeQuibTime != undefined && ComposeQuibTime.length > 0 && ComposeQuibTime > 0)
            $("#BtnSave").html(ComposeQuibTime);
        else
            $("#BtnSave").html($('#movieTimer').val());

        if (IsQuibZeroOpen)
            $("#txtComposeQuib").attr("placeholder", "write a quib zero...");
        else
            $("#txtComposeQuib").attr("placeholder", "write a quib...");

        $('#myStreamCompose').css("height", "52");
        $('#txtComposeQuib').val('');
        $('#txtComposeQuib').focus();

        // Get all quibs of a user to show in my stream panel
        GetQuibByUserIdAndMovieId().then(function (response) {
            // variable used to set the height of my stream dynamically
            setbool = true;

            // Setting focus to compose areao
            $('.my-stream-panel').fadeIn().removeClass('hide');            

            //goToByScrollState1($('.quibId').filter(function () {
            //    return this.value == $('#BumpQuibId').val()
            //}).parents('.mystream-wrapper'));

            goToByScrollState1($("input[value=" + $('#BumpQuibId').val() + "][class='quibId']").parents('.mystream-wrapper'));
        });

        $('#bump-modal').modal('hide');
    });

    BindTagClick();
    SetMoviePoster();
    BindQuibTimeStampClick();
    BindQuibAvatarClick();

    enabledisableNoSleep(false);
});

function BindQuibAvatarClick() {
    // dropdown on quib avatar click
    $('.avatar-quibcomposer').on('click', function () {

        if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {
            if ($('#txtComposeQuib').val().length > 0) {
                $('#save-quib-modal').modal('show');
            }
            else {
                $('.quib-compose-header').find('.drop-down-icon').hide();
                $(this).parent('.quib-compose-header').find('.drop-down-icon').show();
            }
        }
        else {
            $('#guest-login-modal').modal('show');
        }
    });
}

//user avatar drop down - go to user profile
function GotoProfile(userId) {
    window.location.href = localStorage.getItem('environment') + "Profile?userId=" + userId;
}

//follow user -  ddl user avatar
function FollowUser(followeeId) {
    $.ajax({
        //async: false,
        url: localStorage.getItem('environment') + 'Profile/AddCommunity',
        data: { followeeId: followeeId },
        type: 'POST',
        success: function (response) {
            if (JSON.parse(response)) {
                $('.drop-down-icon').hide();
                $('#follow-modal').modal('show');
            }
        }
    });
}

// User avatar drop down QUIB STACK click
function GotoQuibStack(userId, movieId) {
    $('.popup_load').css('display', 'block');
    window.location.href = localStorage.getItem('environment') + "QuibStack?userId=" + userId + "&movieId=" + movieId;
    setTimeout(function () {
        $('.popup_load').css("display", "none");
    }, 5000);
}

// binding bump click
function BindBumpClick() {

    // Bump click to like quib and reply to it
    $('.img-bump').on('click', function () {
        if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {

            if ($('#txtComposeQuib').val().length > 0) {
                $('#save-quib-modal').modal('show');
            }
            else {
                $('#BumpQuibId').val($(this).parents('.quib-compose-header').find('#QuibId').text());
                $('#bump-modal').modal('show');

            }



        }
        else {
            $('#guest-login-modal').modal('show');
        }
    });
}

// Open my stream on quib-timestamp click
function BindQuibTimeStampClick() {
    $('.quib-compose-timer').on('click', function () {
        if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {
            ComposeQuibTime = $(this).val();
            UpdateComposeTime(ComposeQuibTime);
            //TempComposeTime = $(this).val();


            //if (isRunning) {
            //    SetQuibInterval();
            //}

            if ($('.my-stream-panel').is(':hidden')) {
                // Setting save button text to timer value

                // Get all quibs of a user to show in my stream panel
                GetQuibByUserIdAndMovieId();

                $('.my-stream-panel').fadeIn().removeClass('hide');
            }
            else {
                if ($('#txtComposeQuib').val().length > 0) {
                    $('#save-quib-modal').modal('show');
                }
                else {
                    // Setting save button text to timer value
                    $("#BtnSave").html($(this).val());
                }
            }
            $('#txtComposeQuib').focus();
        }
        else {
            $('#guest-login-modal').modal('show');
        }
    });
}

// Open tags and rating popup
function BindTagClick() {
    // Open tags and rating popup
    $('.img-tag').on('click', function () {

        if (localStorage.getItem('UserId') != null && localStorage.getItem('UserId') != undefined && localStorage.getItem('UserId') != 0) {
            SelectedQuibId = this.parentElement.parentElement.children.QuibId.innerHTML;

            // Get tags from database
            var TagIds = GetTagMapByUserIdAndQuibId(SelectedQuibId);

            UpdateTagCheckbox(TagIds);

            var check = $(this).offset();

            var check = $(this).offset();
            var rateheight = $('#rating-quib').height();
            var cheight = $('.quib-container').height();
            var ratewidth = $('#rating-quib').width();
            var cwidth = $('.quib-container').width();

            if (cheight < (rateheight + check.top)) {
                check.top = check.top - rateheight;
            }

            if (cwidth < (ratewidth + check.left)) {
                check.left = check.left - ratewidth - 20;
            }

            $('#rating-quib').css('top', check.top);
            $('#rating-quib').css('left', check.left + 20)
            $('#rating-quib').show();
        }
        else {
            $('#guest-login-modal').modal('show');
        }
    });

    // Save rating/tags
    $('#btnDone').on('click', function () {

        var selected = [];
        $('#divTags input:checked').each(function () {
            selected.push($(this).attr('id'));
        });

        if (SelectedQuibId != null) {
            // Add tags in database
            AddUpdateTagMap(SelectedQuibId, selected);
            $('#rating-quib').hide();
        }
    });
}

// My stream quib timestamp click
function BindMyStreamTimeStampClick() {
    $('.myStreamQuibTime').on('click', function (e) {
        $('#BtnSave').html(this.value);
        $('#txtComposeQuib').focus();
    });

    // scroll unposted quib on top of my stream when user taps in it
    //$('.unposted-quibs').on('click', function () {
    //    goToByScrollState1($(this).parent());
    //});

    // autosave on blur + change
    $('#myStreamPanel').on('change', '.unposted-quibs', function () {
        var quibId = $(this).parent().find('.quibID').val();
        var body = $(this).val();

        $.ajax({
            //async: false,
            url: localStorage.getItem('environment') + 'QuibStream/UpdateQuibBodyById',
            data: { id: quibId, body: body, isEnabled: true },
            type: 'POST',
            dataType: 'text',
            success: function () {
                //alert('sucess');
                // quib body updated successfully
            }
        });
    });
}

// QUIB STREAM- Loading initial quibs we got from database for a movie
function LoadInitialQuibsQuibStream() {
    $('#quibContainer').append("<div class='quib-item movie-poster-wrapper' prevcol='PrevCol' style='text-align: center;'>" +
         "<div class='panel panel-default quib-item-inner inner1' style=' background-color: white; height:100%'>" +
                                "<div class='panel-body' style='padding: 0 ;height:100%'>" +
                                "<div style='font-size: 24px; font-weight: bold; color: black;padding:7% 0px'>Timeline quibs for</div>" +
                             "<img src='" + $('.MoviePosterThumb').attr('src') + "' />" +
                            "</div>" +
                            "</div>" +
                            "</div>");
}

// QUIB STREAM- Loading ALL quibs we got from database for a movie
function LoadAllQuibsQuibStream(quibs) {
    //$('#quibContainer').empty();
    //var quibs = GetAllQuibsQuibStream();
    lstQuibs = JSON.parse(quibs);
    var object = lstQuibs;
    var time = 0;
    var bumpSign = '';
    var body = '';
    var avatar = null;

    $('.popup_load').css('display', 'block');

    // ADD FIRST MOVIEPOSTER IMAGE COLUMN
    for (var obj in object) {
        if (quibs.hasOwnProperty(obj)) {

            body = (object[obj].IsScreenshot == false) ? object[obj].Body : "<img style='height:auto; width:100%;' id='imgScreenshot" + object[obj].Id + "' src='" + object[obj].Body + "' />";

            if (object[obj].IsQuibZero == true)
                time = 'QUIB ZERO';
            else
                time = object[obj].Time;

            if (object[obj].IsBumped) {
                //bumpSign = "<div class='img-bump'><a  href=#><img src='/Images/expand-red-01.png' /></a></div>";
            }
            var SeedquibClass = "";
            if (object[obj].IsSeedQuib) {
                SeedquibClass = "quib-Seed";
                switch (object[obj].SeedQuibType) {
                    case "exc":
                        //avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABOklEQVRYw+2XsWrCQBzGP6uDSyct0kk6RGhAuFLB1VnoQ+QdfIBODu4ieYJAwHcQnDM5CKEkiFOF65GkDglInQ56Gf+ROwLe9g33v9/33d2fu4YL/MHgeDC5eL0B2paFaRDAKQqMPY8M0PwAPikT35dLvEwmAIAn28bv5YKf7VZfAp3BQNGP/T6pTn3PAA9DRedJohegSFNFZ3GsF6DsOOdcL0DZ8cn3NSdAdHwzgP+Ov3c7/QC3GpUApPPyldSeQPlKagOQzrPDwQyAdJ4LYQZANqN0vzcDIJtRstkYSoBzFOdzlRLVAE6+DxFFlQAa91dxbQHaloU318U0CGAvFmSAFnXi62wG5jgAgN5wiCyOcVyt9CXwPBopussYqQ4ZIFyvFR0RPyfkLfiaz5ELgS5jiDyP3A3vfeAKd5h1K4V+TpsAAAAASUVORK5CYII=';
                        avatar = "/Images/user32/seedExclaimation.png";
                        break;
                    case "que":
                        // avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAACRUlEQVRYw+2XP0gbYRTAf7YlBFLNIgkBRUWvcEpoCgfV7cASodglweDqFJw9FQJCJwen4CKZMkkgIC5OAUtQWqgQDQRiwMaLdGgNNmJtoEqlHYIHsWpyfyQd+qb37t73vt+9797jfW0x+E0L5VErN/8nAJ7ocbYLAqKi4JEk3F6v9vxUVfmyu0shFuMsnX6YDAxEIgR3dgB4PzND3GYjMTRENh7H4XIxGAwSSKUYXFrSBfD4Dbxt5OQKhXi1vExudZW9cJiLUgmAX5UKXzc2OFZVngUCAHQND/Pj6orK9rZ1GZDm5wE4yWZvfV9OJsmvrWn2y9nZpjPQEMApy9p5t/f13emnrq9rus3hYCASsQagQxQ1vXd09E6/cjJZZ7f39FgD8H1/X9PdXi+uUKipwM1KQ4CzdJrjXE6zL8rlW/3sglBnnx8dNQXQVB94NzmJqCicZLN31nnXxISmX1arfFpctA7g58EBe+HwvT69Y2Oanr/xP9wnlrRipyzTPTIC1LpiI1jLAZ4rClBL/YeFBV1rTQM4ZZl+vx+ArUjkr3J8cIDrr/8YjfJ5ZUX3elMAdkGg3++nmEqRn5szFMMUgKgonKoqW+PjhmOYAvBIEplo1EwIcwBP3W5D524JgFOWqRSLpjY3BdAhinwrFEwDtP0fy40ssgsCL2IxXmcyuofQm6JrLL8WUVHwTU0BtSHlXFUNV4OhDHgkqc7u9PkMZ8AQQGlzU9Mvq1UOEwnDAIaroHt6mk6fj8NEQvdtyBIAq6TlZfgHzdKwUcrZKTQAAAAASUVORK5CYII=';
                        avatar = "/Images/user32/seedQuestion.png";
                        break;
                    case "equ":
                        //avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAaElEQVRYw2OcycDwn2EAAdNAWj7qgFEHjDpg1AGjDmBgYGBgwSYoFhbGYFJeTlWLthkbD84QYBytDUe8A7DmAn4HBwalyEiqWnQ+PZ14B/BpajIYJCbSxQGjuWDUAaMOGHXAqANGHQAAWdYN+0tRu40AAAAASUVORK5CYII=';
                        avatar = "/Images/user32/seedEquals.png";
                        break;
                    case "quo":
                        //avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAB10lEQVRYw+2WTUsbURSGH6WoMJZBhIQQskkxhcD4gaCESpiFSBFB3IS4dCGSnQHxJ2QxILhSAu4dAtmFLgQlulAqUgRBaW2TRQ3SVAijBowb3Ygakpm58QMR5izPvPe8zzn3zsxtSsINbxjNb2nuADgADkDDAEFNI6hpQlpfLEY4k3kZAFckQuTkhMD4OGd7e5batq4uhjc3CScSXBQKtrU/iHQ9ODvLn7U1tsbGbM2/3nWdmZjAyGafByCrKn3T00LmAEMrK0guF+mBAa6Oj0WGa70FXxYWANiNx20L+WIxfKEQh6mUsLklgKyquBWFUi4nVPBzNArA2f6+sLklgHd0tKFC7u5uAM6PjhpaZ3oGWmUZgA6/n75kko9eL+0eD7/SaX4nEjX6FkkCoGdujsrMDJ2BAJenp+zG45YTtH0LWiSJ3qmph04Vhf/b26Yn/NPISJW2Xdf51t9vWt90Cwrr66aL/JOTNbm/Ozt1tW5FsWzQFKCYSvHv4KDus4ph1OR+6npdbblYfBoAwEY0Simfr8qV8nkO5+drJ7C8zPfFxarcdbnMj6UlS4AmkTthUNNolWUqhlHX/HHIqnq/RbnVVduvoRDAa8b7+h07AA6AA+AAvEbcAgITjqrNm3S6AAAAAElFTkSuQmCC';
                        avatar = "/Images/user32/seedQuote.png";
                        break;
                    case "col":
                        // avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAArElEQVRYw2OcycDwn2EAAdNAWj7qgFEHDG0HcKiqMhjOnMngdfYsg1ZXF9kOYCFXo2ZJCYNBYiIDAwMDg7iuLsPn+/cZHk+fTr8QkDQxQeGLGBiQZQ7ZDri1di0K/97y5WSZQ3YU3GlrY/j5/j2DiIEBw73lyxk+HjhAljmMo3XBqANGHTDqgCHrgNHacMBrwwd798LZv75+Jbs2pKgyks3MHK0NRx0w6gCKAQBoBDxBbN3dTQAAAABJRU5ErkJggg==';
                        avatar = "/Images/user32/seedColon.png";
                        break;
                    default:
                        // avatar = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABOklEQVRYw+2XsWrCQBzGP6uDSyct0kk6RGhAuFLB1VnoQ+QdfIBODu4ieYJAwHcQnDM5CKEkiFOF65GkDglInQ56Gf+ROwLe9g33v9/33d2fu4YL/MHgeDC5eL0B2paFaRDAKQqMPY8M0PwAPikT35dLvEwmAIAn28bv5YKf7VZfAp3BQNGP/T6pTn3PAA9DRedJohegSFNFZ3GsF6DsOOdcL0DZ8cn3NSdAdHwzgP+Ov3c7/QC3GpUApPPyldSeQPlKagOQzrPDwQyAdJ4LYQZANqN0vzcDIJtRstkYSoBzFOdzlRLVAE6+DxFFlQAa91dxbQHaloU318U0CGAvFmSAFnXi62wG5jgAgN5wiCyOcVyt9CXwPBopussYqQ4ZIFyvFR0RPyfkLfiaz5ELgS5jiDyP3A3vfeAKd5h1K4V+TpsAAAAASUVORK5CYII=';
                        avatar = "/Images/user32/seedExclaimation.png";
                }
            }
            else {
                //avatar = object[obj].AvatarBase64Thumb;
                avatar = object[obj].AvatarBase32ImagePath;//TODO Anish
                if (!avatar) {
                    // avatar = "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";
                    avatar = "/Images/user32/AvatarBase32.png";
                }
            }

            if (!object[obj].IsScreenshot) {
                $('#quibContainer').append("<div class='quib-item " + time + "'  time='Parent_" + time + "' style='visibility:hidden'> " +
                     "<div class='panel panel-default quib-item-inner inner1'>" +
                                    "<div class='panel-body' style='padding: 0;'>" +
                                                "<div class='quib-compose-wrapper'>" +
                                                    "<div class='quib-compose-header'>" +
                                                        //"<img src='data:image/jpeg;base64," + avatar + "' class='avatar-quibcomposer' />" +
                                                         "<img src='" + avatar + "' class='avatar-quibcomposer' />" +
                                                        "<span class='composer-name " + SeedquibClass + "' style='font-weight: bold'> " + object[obj].DisplayName + "</span>" +
                                                        "<span id='QuibId' class='hide'>" + object[obj].Id + "</span>" +
                                                        "<div class='quib-compose-timer-wrapper'>" +
                                                            "<input type='text' class='form-control quib-compose-timer' value='" + time + "' readonly='true' />" +
                                                        "</div>" +
                                                        "<div class='compose-side-header' style='float: right'>" +
                                                            //"<a class='img-tag'>" +
                                                            //    "<img src='/Images/tag.png' />" +
                                                            //"</a>" +
                                                            "<a class='img-bump'>" +
                                                                "<img src='" + localStorage.getItem('environment') + "Images/bump-red.png' />" +
                                                            "</a>" +
                                                       "</div>" +
                                                       "<div class='drop-down-icon'>" +
                                                        "<ul>" +
                                                            "<li onclick='FollowUser(" + object[obj].UserId + ")' data-toggle='modal' data-target='#follower-modal'>Follow</li>" +
                                                            "<li onclick='GotoProfile(" + object[obj].UserId + ")'>See Profile</li>" +
                                                            "<li onclick='GotoQuibStack(" + object[obj].UserId + "," + object[obj].MovieId + ")'>See Stream</li>" +
                                                            //'<li onclick=' + gotoQuibStack + '>See Stream</li>' +
                                                        "</ul>" +
                                                    "</div>" +
                                                   "</div>" +
                                                   "<div class='quib-composer " + SeedquibClass + "'>" +
                                                      body +
                                                   "</div>" +
                                                   bumpSign +
                                                "</div>" +
                                                "</div>" +
                                                "</div>" +
                                            "</div>");
            }
            else {
                $('#quibContainer').append("<div class='quib-item " + time + "'  time='Parent_" + time + "' style='visibility:hidden'> " +
                     "<div class='panel panel-default quib-item-inner inner1'>" +
                                    "<div class='panel-body' style='padding: 0;'>" +
                                                "<div class='quib-compose-wrapper'>" +
                                                    "<div class='quib-compose-header'>" +
                                                        "<span id='QuibId' class='hide'>" + object[obj].Id + "</span>" +
                                                        "<div class='quib-compose-timer-wrapper' style='top: 0;'>" +
                                                            "<input type='text' class='form-control quib-compose-timer' value='" + time + "' readonly='true' />" +
                                                        "</div>" +
                                                        "<div class='compose-side-header' style='float: right'>" +
                                                            "<a class='img-bump'>" +
                                                                "<img src='" + localStorage.getItem('environment') + "Images/bump-red.png' />" +
                                                            "</a>" +
                                                       "</div>" +
                                                       "<div class='drop-down-icon'>" +
                                                        "<ul>" +
                                                            "<li onclick='FollowUser(" + object[obj].UserId + ")' data-toggle='modal' data-target='#follower-modal'>Follow</li>" +
                                                            "<li onclick='GotoProfile(" + object[obj].UserId + ")'>See Profile</li>" +
                                                            "<li onclick='GotoQuibStack(" + object[obj].UserId + "," + object[obj].MovieId + ")'>See Stream</li>" +
                                                        "</ul>" +
                                                    "</div>" +
                                                   "</div>" +
                                                   "<div class='quib-composer " + SeedquibClass + "' style='margin-top: -20px;'>" +
                                                      body +
                                                   "</div>" +
                                                   bumpSign +
                                                "</div>" +
                                                "</div>" +
                                                "</div>" +
                                            "</div>");
            }

        }
    }




    //ApplyStyleToQuibStream();

    BindBumpClick();
    BindQuibTimeStampClick();
    BindTagClick();
    BindQuibAvatarClick();
    $('#quibContainer').show();
}

// Clear text of compose box and reduce height to default
function ResetQuibComposeBox() {
    $('#myStreamCompose').height('52px');
    $('#txtComposeQuib').val("");
}

// Get NON-ZERO initial quibs from database
function GetInitialQuibsQuibStream() {
    var content;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + 'QuibStream/GetInitialQuibsByMovieId',
        dataType: 'text',
        data: { movieId: localStorage.getItem('MovieId'), isQuibZero: false, selectedStreams: selectedStreams },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        }
    });
    return content;
}

// Get NON-ZERO ALL quibs from database
function GetAllQuibsQuibStream() {
    var content;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + 'QuibStream/GetQuibsByMovieId',
        dataType: 'text',
        data: { MovieId: localStorage.getItem('MovieId'), isQuibZero: false, selectedStreams: selectedStreams },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    return content;
}

// Get NON-ZERO ALL quibs from database with interval of 30 seconds
function GetQuibsByMovieIdForInterval(startTime, endTime) {
    var content;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + 'QuibStream/GetQuibsByMovieIdForInterval',
        dataType: 'text',
        data: { MovieId: localStorage.getItem('MovieId'), isQuibZero: false, selectedStreams: selectedStreams, startTime: startTime, endTime: endTime },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        },
        
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    return content;
}

// convert hh:mm:ss to seconds
function ConvertTimeToSeconds(hms) {
    // split by the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.0
    var temp = hms.split(':');
    var seconds = (+temp[0]) * 60 * 60 + (+temp[1]) * 60 + (+temp[2]);
    return seconds;
}

// Storing bumped quib from compose panel - Save click
function AddBumpQuib() {
    $.ajax({
        //async: false,
        url: localStorage.getItem('environment') + 'QuibStream/GetQuibsByMovieId',
        type: 'POST',
        dataType: 'text',
        data: { MovieId: localStorage.getItem('MovieId'), isQuibZero: false },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        }
    });
}

// Get Qyuibs by parent id. (child quibs - by clicking on star button)
function GetAllQuibsByParentId(ParentId) {
    var content;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + 'QuibStream/GetQuibByParentId',
        type: 'POST',
        dataType: 'text',
        data: { ParentId: ParentId },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        }
    });
    return content;
}

// Bump button click only (not reply)
function AddBump(quibId, movieId) {
    $.ajax({
        //async: false,
        url: localStorage.getItem('environment') + 'QuibStream/AddBump',
        data: { quibId: quibId, movieId: movieId },
        success: function (response) {
        }
    });
}

// Open my stream panel
function OpenMyStream() {

    openmystream = true;

    resizemystream = false;
    if (localStorage.getItem('UserId') == '30') {
        $('#register-modal').modal('show');
    }
    else {

        setbool = true;

        if (IsQuibZeroOpen)
            $("#txtComposeQuib").attr("placeholder", "write a quib zero...");
        else
            $("#txtComposeQuib").attr("placeholder", "write a quib...");

        $('#myStreamCompose').css("height", "52");
        $('#txtComposeQuib').val('');
        $('#txtComposeQuib').focus();

        // Get all quibs of a user to show in my stream panel
        GetQuibByUserIdAndMovieId().then(function (response) {
            // Setting focus to compose area
            $('.my-stream-panel').fadeIn().removeClass('hide');
            ResizeMyStreamTextArea();
            BindTagClick();
        });
    }
}

// quib zero movie poster
function SetMoviePoster() {
    $.ajax({
        //async: false,
        url: localStorage.getItem('environment') + 'ChooseMovie/GetMoviePosterById',
        data: { movieId: queryStringValuefromKey("movieId") },
        success: function (response) {
            if (response != undefined && response != null) {

                //KVW - use file path not base64
                if (response.length >= 100)
                    $("#quibZeroMoviePoster").attr("src", "data:image/jpeg;base64," + response);
                else
                    $("#quibZeroMoviePoster").attr("src", response);
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        }
    });
}

/* Prevent display sleep and enable wake lock in all Android and iOS web browsers - NoSleep.js */

//Create a new NoSleep object and then enable or disable
var noSleep = new NoSleep();

//Enable or diable the sleep event of mobile according Yes/No
function enabledisableNoSleep(yesno) {
    if (yesno) {
        noSleep.enable();
    }
    else {
        noSleep.disable();
    }
}