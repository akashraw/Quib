// Timer related variables
var movieLength = 0;
var selectedMovieLength = 0;
var isRunning = false;
var totalTicks = 0;
var timer;
var quibData = [];
var isSliderSync = true;
var checkslider = true;

var imgPath = '../Images/';
var imgNamePlay = 'play.png';
var imgNamePause = 'Pause.png';

var quibs;
var initialQuibs;

var IsPlayBtnPressed;
var isNavButtonClick = false;
var IsIntervalTimeUP = false;

var TempTotalTicksQuibScrubber;
var setslider = true;

$(document).ready(function () {

    // when we resync scrubbers. clearing quibs ahead of time
    function ClearQuibsAhead(quibTime, quibScrbrStartClick) {
        showLoadingGIF().then(function () {
            //for (i = quibTime + 1 ; i <= selectedMovieLength ; i++) {
            //    $(".quib-item input[value='" + i + "']").parents(".quib-item").css("visibility", "hidden");
            //}

            $('.quib-item .quib-compose-timer').filter(function (index, val) {
                if (parseInt(ConvertTimeToSeconds($(val).val())) > parseInt(quibTime)) {
                    $(val).parents('.quib-item').css('visibility', 'hidden');
                }
                else {
                    $(val).parents('.quib-item').css('visibility', 'visible');
                }
            });

            //VIEWPORT START
            var cols_array = [];
            $(".quib-item").withinviewport().each(function () {
                cols_array.push(parseInt($(this).attr("colmvalue")));
            });


            if ((parseInt($('#quibContainer').width() - $('.quib-item').width())) == 0) {
                var curColumnValue = Math.min.apply(Math, cols_array);
            }
            else {
                var curColumnValue = Math.min.apply(Math, cols_array) + 1;
            }
            //VIEWPORT END
            if (totalTicks - quibScrbrStartClick > 0) {
                var highColumnValue = $('.HilightQuib').first().attr('colmValue');
                var slidesToClick = (highColumnValue - curColumnValue);
                var scrollval = ($('.quib-item').width()) * slidesToClick;

                if (sliderflag) {
                    scrollByNew(scrollval);
                }
            }
            else {
                var highColumnValue = $('.HilightQuib').first().attr('colmValue');
                var slidesToClick = (curColumnValue - highColumnValue);
                var scrollval = ($('.quib-item').width()) * slidesToClick;

                if (sliderflag) {
                    scrollByNew(-scrollval);
                }
            }
            $('.popup_load').css('display', 'none');


        });
    }

    // when we resync scrubbers. clearing quibs ahead of time
    function ClearOnlyQuibsAhead(quibTime) {
        showLoadingGIF().then(function () {
            //for (i = quibTime + 1 ; i <= selectedMovieLength ; i++) {
            //    $(".quib-item input[value='" + i + "']").parents(".quib-item").css("visibility", "hidden");
            //}

            $('.quib-item .quib-compose-timer').filter(function (index, val) {
                if (parseInt(ConvertTimeToSeconds($(val).val())) > parseInt(quibTime)) {
                    $(val).parents('.quib-item').css('visibility', 'hidden');
                }
                else {
                    $(val).parents('.quib-item').css('visibility', 'visible');
                }
            });

            $('.popup_load').css('display', 'none');
        });


    }

    // PLAY MOVIE
    function PlayMovie() {
        $('.movie-time-wrapper').css('margin-top', 0)
        isRunning = !isRunning;
        if (selectedMovieLength != 0) {
            if (isRunning) {
                // Starting actual timer
                StartTimer();
                $('#imgPlayPause').attr('src', imgPath + imgNamePause);
                UpdateComposeTime($('#movieTimer').val());

                // Update timeline and timer control ui for quib zero
                // parameter: IsQuibZero?
                UpdateUIControls(false);

                isSliderSync = true;

                $('#QuibScrubber').css('background-image', "url('" + localStorage.getItem('environment') + "/Images/bottom.png')");

                // if user hit play button when movie is desync, we need to sync back and hide all quibs having greater time then movie timer
                ClearQuibsAhead($('#movieSlider').slider('value'));
            }
            else {
                StopTimer();
                $('#imgPlayPause').attr('src', imgPath + imgNamePlay);
            }
        }
    }

    // Timeline big circle (O) click at beginning of timeline
    $('#btnQuibZero').on('click', function () {
        if ($('#txtComposeQuib').val().length > 0) {
            $('#save-quib-modal').modal('show');
        }
        else {
            // Loading quib zeros
            $('.popup_load').css('display', 'block');
            window.location.href = localStorage.getItem('environment') + '/QuibStream/Index?MovieId=' + localStorage.getItem('MovieId') + '&isQuibZero=true';
        }
    });

    // Timer plus (+) button click of timer
    $('#btnPlus').on('click', function () {
        if (totalTicks < selectedMovieLength) {
            totalTicks++;
            ChangeValueAndTime('#movieSlider', '#movieTimer', totalTicks, true, true);
            ChangeValueAndTime('#slider', '#quibTimer', totalTicks, true, false);
            CurrentQuib();
            UpdateComposeTime($('#movieTimer').val());

            // Param : IsQuibZero?
            UpdateUIControls(false);
        }
    });

    // Timer minus (-) button click of timer
    $('#btnMinus').on('click', function () {
        if (totalTicks > 1) {
            totalTicks--;
            ChangeValueAndTime('#movieSlider', '#movieTimer', totalTicks, true, true);
            ChangeValueAndTime('#slider', '#quibTimer', totalTicks, true, false);
            CurrentQuib();
            UpdateComposeTime($('#movieTimer').val());

            // Param : IsQuibZero?
            UpdateUIControls(false);
        }
    });

    // Timeline - Resync button click
    $('#btn-resynquib').on('click', function () {
        if ($('#txtComposeQuib').val().length > 0) {
            $('#save-quib-modal').modal('show');
        }
        else {
            var quibScrbrStartClick = $('#quibSlider').slider('value');

            $('#QuibScrubber').css('background-image', "url('" + localStorage.getItem('environment') + "/Images/bottom.png')");

            isSliderSync = true;
            isNavButtonClick = false;
            ChangeValueAndTime('#quibSlider', '#timer', $('#movieSlider').slider('value'), false, true);
            ClearQuibsAhead($('#movieSlider').slider('value'), quibScrbrStartClick);
        }
    });

    // Timer Play button click
    $('.btnPlay').on('click', function () {
        var that = $(this).find('#imgPlayPause');

        enabledisableNoSleep(true);
        if (IsQuibZeroOpen) {
            if ($('#txtComposeQuib').val().length > 0) {
                $('#save-quib-modal').modal('show');
            }
            else {
                resizemystream = true;
                openmystream = false;
                $('.my-stream-panel').fadeOut();
                isNavButtonClick = false;


                if ($('#txtComposeQuib').val().length > 0) {
                    $('#save-quib-modal').modal('show');
                }
                else {
                    showLoadingGIF().then(function () {
                        // Timer font size and text
                        // Param : IsQuibZero?

                        FormatTimer(false);

                        IsQuibZeroOpen = false;

                        $('.popup_load').css('display', 'block');

                        // closing my stream panel
                        $('.my-stream-panel').addClass('hide');

                        // Param : IsQuibZero?
                        UpdateUIControls(false);

                        $('#quibContainer').empty();

                        LoadInitialQuibsQuibStream();
                        LoadAllQuibsQuibStream(initialQuibs);
                        LoadAllQuibsQuibStream(quibs);


                        setTimeout(function () {
                            $('.quib-item').css('visibility', 'visible');

                            UpdateComposeTime((ConvertTimeToSeconds($('#movieTimer').val())).toString().toHHMMSS());

                            PlayMovie();

                            // My stream compose timer                                                
                            $('.quib-compose-timer').formatTime();
                            $('.popup_load').css('display', 'none');
                        }, 3000);
                    });
                }

            }
        }
        else {
            var quibScrbrStartClick = $('#quibSlider').slider('value');
            IsIntervalTimeUP = false;
            isNavButtonClick = false;
            PlayMovie();

            // button src gets change in playmovie() function
            //if (that.attr('src') == imgPath + imgNamePause) {
            //    ClearOnlyQuibsAhead($('#movieSlider').slider('value'));
            //}
        }

    });

    // Toggle timer button click to toggle between running time and remaining time
    $('#TimerToggle').on('click', function () {
        $('#movieTimer').toggle();
        $('#quibTimer').toggle();
    });



    // Slide event of a movie scrubber
    $('#movieSlider').slider({
        change: function (e, ui) {
            if ($(this).slider('value') == 1)
                ApplyStyleToQuibStream();
            if (isSliderSync) {
                if (IsQuibZeroOpen) {
                    // When user manually tap slider from quib zero
                    if ($(this).slider('value') > 0) {

                        if ($('#txtComposeQuib').val().length > 0) {
                            $('#save-quib-modal').modal('show');
                        }
                        else {
                            var that = this;
                            showLoadingGIF().then(function () {
                                // Timer font size and text
                                // Param : IsQuibZero?
                                FormatTimer(false);

                                IsQuibZeroOpen = false;

                                // closing my stream panel
                                $('.my-stream-panel').addClass('hide');

                                // Param : IsQuibZero?
                                UpdateUIControls(false);

                                $('#quibContainer').empty();
                                LoadInitialQuibsQuibStream();
                                LoadAllQuibsQuibStream(initialQuibs);
                                LoadAllQuibsQuibStream(quibs);
                                ApplyStyleToQuibStream();

                                UpdateComposeTime((ConvertTimeToSeconds($('#movieTimer').val())).toString().toHHMMSS());

                                // My stream compose timer
                                $('.quib-compose-timer').formatTime();

                                $('.popup_load').css('display', 'none');
                                showQuibsAndslide(that);
                            });
                        }
                    }
                    else {
                        showQuibsAndslide(this);
                    }
                }
                else {
                    showQuibsAndslide(this);
                }
            }
            else {
                ShowQuibsAtThisTime($(this).slider('value').toString().toHHMMSS());

                // updating movie timer
                ChangeValueAndTime('#slider', '#movieTimer', totalTicks, true, false);

                if (ConvertTimeToSeconds($('#movieTimer').val()) >= selectedMovieLength) {
                    $('#end-movie-modal').modal('show');
                    enabledisableNoSleep(false);
                }
            }
        },

        start: function (e) {
            TempTotalTicks = $(this).slider('value');

            checkslider = false;
        },

        stop: function (e) {

            checkslider = true;
            var temp = $('.' + parseInt($(this).slider('value')) + '').last().attr('colmValue');
            var tempTime = $('#quibSlider').slider('value');
            var movieScrubberVal = parseInt($(this).slider('value'));
            var quibScrbrStartClick = $('#quibSlider').slider('value');

            $('#QuibScrubber').css('background-image', "url('" + localStorage.getItem('environment') + "/Images/bottom.png')");
            $('.quib-item').css('visibility', 'visible');


            if (IsQuibZeroOpen) {
                // When user manually tap slider from quib zero
                if ($(this).slider('value') > 0) {

                    if ($('#txtComposeQuib').val().length > 0) {
                        $('#save-quib-modal').modal('show');
                    }
                    else {
                        // Timer font size and text
                        // Param : IsQuibZero?
                        $('.popup_load').css('display', 'block');
                        FormatTimer(false);

                        IsQuibZeroOpen = false;

                        // closing my stream panel
                        $('.my-stream-panel').addClass('hide');

                        // Param : IsQuibZero?
                        UpdateUIControls(false);

                        $('#quibContainer').empty();

                        LoadInitialQuibsQuibStream();
                        LoadAllQuibsQuibStream(initialQuibs);
                        LoadAllQuibsQuibStream(quibs);
                        ApplyStyleToQuibStream();

                        $('.quib-item').css('visibility', 'visible');

                        UpdateComposeTime((ConvertTimeToSeconds($('#movieTimer').val())).toString().toHHMMSS());

                        PlayMovie();

                        // My stream compose timer                                                
                        $('.quib-compose-timer').formatTime();

                        //showing previous quibs where there is no quibs for particular scrubber value 

                        if (temp == null || temp == undefined) {
                            $('.quib-item .quib-compose-timer').filter(function (index, val) {

                                if (ConvertTimeToSeconds($(val).val()) < movieScrubberVal) {
                                    temp = $('.' + ConvertTimeToSeconds($(val).val()) + '').last().attr('colmValue');
                                    tempTime = ConvertTimeToSeconds($(val).val());
                                }
                            });
                        }
                    }
                }
            }
            else {

                //showing previous quibs where there is no quibs for particular scrubber value 
                if (temp == null || temp == undefined) {
                    $('.quib-item .quib-compose-timer').filter(function (index, val) {

                        if (ConvertTimeToSeconds($(val).val()) < movieScrubberVal) {
                            temp = $('.' + ConvertTimeToSeconds($(val).val()) + '').last().attr('colmValue');
                            tempTime = ConvertTimeToSeconds($(val).val());
                        }
                    });
                }
            }

            isSliderSync = true;
            ShowQuibsAtThisTime(tempTime.toString().toHHMMSS());
            setTimeout(function () { ClearOnlyQuibsAhead($('#movieSlider').slider('value'), quibScrbrStartClick); }, 400);
        },

        slide: function (e) {
            ChangeValueAndTime('#slider', '#movieTimer', $(this).slider('value'), true, true);
        }
    });

    function showQuibsAndslide(that) {
        ShowQuibsAtThisTime($(that).slider('value').toString().toHHMMSS());

        // Getting actual time based on slider position
        totalTicks = $(that).slider('value');

        // Only possible in manual scrubber sliding
        if (totalTicks < 1) {
            totalTicks = 1;
            ChangeValueAndTime('#movieSlider', '#movieTimer', totalTicks, true, true);
        }

        // Updating quib slider position
        ChangeValueAndTime('#quibSlider', '#quibTimer', totalTicks, true, true);

        //VIEWPORT START
        var cols_array = [];
        $(".quib-item").withinviewport().each(function () {
            cols_array.push(parseInt($(this).attr("colmvalue")));
        });

        if ((parseInt($('#quibContainer').width() - $('.quib-item').width())) == 0) {
            var curColumnValue = Math.min.apply(Math, cols_array);
        }
        else {
            var curColumnValue = Math.min.apply(Math, cols_array) + 1;
        }
        //VIEWPORT END

        if ($('.HilightQuib').first().attr('colmValue') - curColumnValue > 0) {
            var highColumnValue = $('.HilightQuib').first().attr('colmValue');
            var highlastValue = $('.HilightQuib').last().attr('colmValue');

            var slidescheck = (highlastValue - curColumnValue);
            var slidesToClick = (highColumnValue - curColumnValue);
            if ((slidescheck + 1) > parseInt(Math.round($('#quibContainer').width() / $('.quib-item').width()) - 1)) {
                var scrollval = ($('.quib-item').width()) * slidesToClick;
                scrollByNew(scrollval);
            }
        }
        else {
            var highColumnValue = $('.HilightQuib').attr('colmValue');
            var slidesToClick = (curColumnValue - highColumnValue);
            if (slidesToClick >= (parseInt($('#quibContainer').width() / $('.quib-item').width()) - 2)) {
                var scrollval = ($('.quib-item').width()) * slidesToClick;
                scrollByNew(-scrollval);
            }
        }
        TempTotalTicks = totalTicks;

        // updating movie timer
        ChangeValueAndTime('#slider', '#movieTimer', totalTicks, true, false);

        if (ConvertTimeToSeconds($('#movieTimer').val()) >= selectedMovieLength) {
            $('#end-movie-modal').modal('show');
            enabledisableNoSleep(false);
        }
    }

    // Slide event of a quib scrubber
    $('#quibSlider').slider({
        change: function (e) {
            if (!isNavButtonClick) {

                if ($(this).slider('value') < 1) {
                    ChangeValueAndTime('#quibSlider', '#timer', 1, false, true);

                    $slider = $('#quibSlider');
                    $slider.slider('option', 'stop').call($slider);
                }
            }
        },

        start: function (e) {
            if (setslider) {
                TempTotalTicksQuibScrubber = $(this).slider('value');
                checkslider = false;
                setslider = false;
            }
        },
        stop: function (e) {
            setslider = true;
            checkslider = true;
            isSliderSync = false;

            $('.quib-item').css('visibility', 'visible');

            $('#QuibScrubber').css('background-image', "url('" + localStorage.getItem('environment') + "/Images/bottom_line.png')");

            // changing compose timer to match movie timer
            if (!$('.my-stream-panel').is(':hidden')) {
                //UpdateComposeTime($('#movieTimer').val());
                if (isRunning) {
                    SetQuibInterval();
                }
            }

            var temp = $('.' + parseInt($(this).slider('value')) + '').last().attr('colmValue');
            var tempTime;
            var quibScrubberVal = parseInt($(this).slider('value'));

            if (temp == null || temp == undefined) {
                $('.quib-item .quib-compose-timer').filter(function (index, val) {

                    if (ConvertTimeToSeconds($(val).val()) < quibScrubberVal) {
                        temp = $('.' + ConvertTimeToSeconds($(val).val()) + '').last().attr('colmValue');
                        tempTime = ConvertTimeToSeconds($(val).val());
                    }
                });
                ChangeValueAndTime('#quibSlider', '#timer', tempTime, true, true);
            }


            //VIEWPORT START
            var cols_array = [];
            $(".quib-item").withinviewport().each(function () {
                cols_array.push(parseInt($(this).attr("colmvalue")));
            });


            if ((parseInt($('#quibContainer').width() - $('.quib-item').width())) == 0) {
                var curColumnValue = Math.min.apply(Math, cols_array);
            }
            else {
                var curColumnValue = Math.min.apply(Math, cols_array) + 1;
            }
            //VIEWPORT END

            if (parseInt($(this).slider('value')) > TempTotalTicksQuibScrubber) {
                var highColumnValue = temp;
                var slidesToClick = Math.abs(highColumnValue - curColumnValue);
                if (slidesToClick >= (parseInt($('#quibContainer').width() / $('.quib-item').width()) - 2)) {
                    var scrollval = ($('.quib-item').width()) * slidesToClick;

                    if (sliderflag) {
                        scrollByNew(scrollval);
                    }
                }
            }
            else {
                var highColumnValue = $('.' + parseInt($(this).slider('value')) + '').attr('colmValue');
                if ($(this).slider('value') < 1) {
                    highColumnValue = 1;
                    ChangeValueAndTime('#quibSlider', '#timer', 1, false, true);
                }
                var slidesToClick = Math.abs(curColumnValue - highColumnValue);
                if (slidesToClick >= (parseInt($('#quibContainer').width() / $('.quib-item').width()) - 2)) {
                    var scrollval = ($('.quib-item').width()) * slidesToClick;

                    if (sliderflag) {
                        scrollByNew(-scrollval);
                    }
                }
            }
        },

        slide: function (e) {
        },
        animate: true

    });
    if (localStorage.getItem("imgPlayStreamQSClicked") == "true") {
        // setTimeout(function () { $(".btnPlay").trigger('click'); }, 3000);
        //localStorage.setItem("imgPlayStreamQSClicked", false);

    }
});

function scrollByNew(x) {
    sliderflag = false;
    $('#quib-list').animate({
        scrollLeft: '+=' + x,
    }, 300, function () {
        // Animation complete.
        sliderflag = true;
    });
}

// Draw timeline according to movie length and put pipes for all quibs
function drawTimeLine() {
    var obj = GetAllQuibsTime();
    var quibData = JSON.parse(obj);

    var canvas = document.getElementById('timelineCanvas');
    var canvas_width = $('#timelineCanvas').width();

    canvas.setAttribute('width', 'canvas_width');
    canvas.setAttribute('height', '14px');
    canvas.width = canvas_width;

    if (canvas.getContext) {
        // Getting the length of movie from database
        selectedMovieLength = GetQuibAndMovieData();

        // Setting the length of scrubbers' sliders
        // movie scrubber
        $('#movieSlider').slider({
            max: selectedMovieLength
        });

        // quib scrubber
        $('#quibSlider').slider({
            max: selectedMovieLength
        });

        var zeroWidth = 0;
        var totalWidth = canvas.width;
        var widthWithoutZero = canvas.width - zeroWidth;
        var pixelPerSecond = widthWithoutZero / selectedMovieLength;
        var ctx = canvas.getContext('2d');

        ctx.strokeStyle = '#900';
        ctx.beginPath();
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#707070';
        ctx.beginPath();
        ctx.moveTo(zeroWidth, 8);
        ctx.lineTo(totalWidth, 8);
        ctx.closePath();
        ctx.stroke();

        for (var i = 0; i < quibData.length; i++) {
            if (!quibData[i].IsQuibZero) {
                ctx.strokeStyle = '#900';
                ctx.beginPath();
                var position = Math.round(zeroWidth + (quibData[i] * pixelPerSecond));
                ctx.moveTo(position, 0);
                ctx.lineTo(position, 15);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

// on +/- button click moving slider and changing time of timer
function ChangeValueAndTime(sliderChosen, timerChosen, timeToChange, isTimer, isSlider) {
    var TimerTime = 0;

    if (timeToChange > 0) {

        if (timerChosen == '#quibTimer')
            TimerTime = selectedMovieLength - timeToChange;
        else
            TimerTime = timeToChange;

        if (isTimer) {
            $(timerChosen).val(TimerTime);
            $(timerChosen).formatTime();
        }
        if (isSlider) {
            $(sliderChosen).slider('value', timeToChange);
        }
    }
}

// TIMELINE - Get the lingth of movie
function GetQuibAndMovieData(callback) {
    var length;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + '/AdminPanel/GetMovieLengthById',
        type: 'POST',
        dataType: 'text',
        success: function (response) {
            if (response != undefined && response != null) {
                length = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        },
    });
    return length;
}

// get all quibs time to draw timeline
function GetAllQuibsTime() {
    var content;
    $.ajax({
        async: false,
        url: localStorage.getItem('environment') + '/QuibStream/GetAllQuibsTime',
        dataType: 'text',
        data: { movieId: queryStringValuefromKey("movieId") },
        success: function (response) {
            if (response != undefined && response != null) {
                content = response;
            }
            else {
                alert("Can't complete action at this time. Please try again later.");
            }
        },
    });
    return content;
}

// Close popup modal
function leaveComposeModalYes() {
    resizemystream = true;
    openmystream = false;
    $('.my-stream-panel').fadeOut();
    $('#leave-compose-modal').modal('hide');
    PlayMovie();
}

// prototype to convert seconds to HH:MM:SS
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

// Show hidden quibs at perticular time when movie slider value changes
function ShowQuibsAtThisTime(quibTime) {
    var objList = $("[time='Parent_" + ConvertTimeToSeconds(quibTime) + "']");

    if (objList.length > 0) {
        $(".HilightQuib").removeClass('HilightQuib').css('visibility', 'visible');

    }
    objList.fadeIn().addClass('HilightQuib').css('visibility', 'visible');
}