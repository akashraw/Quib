// start timer
function StartTimer() {
    StopTimer();

    timer = jQuery.timer(1000, function () {
        totalTicks++;

        if (totalTicks <= selectedMovieLength) {
            if (checkslider) {
                ChangeValueAndTime('#slider', '#quibTimer', totalTicks, true, false);
                ChangeValueAndTime('#slider', '#movieTimer', totalTicks, true, false);
                ChangeValueAndTime('#movieSlider', '#timer', totalTicks, false, true);
            }
            CurrentQuib();

            UpdateComposeTime(ConvertTimeToSeconds($('#movieTimer').val()).toString().toHHMMSS());
        }
        else {
            StopTimer();
            return false;
        }

    });
}

// stop timer
function StopTimer() {
    if (timer) {
        timer.stop();
    }
}

// called every second
function CurrentQuib() {
    if (totalTicks == 0) {
        // Param : IsQuibZero?
        FormatTimer(true);
        IsQuibZeroOpen = true;
    }
    else {
        // Param : IsQuibZero?
        FormatTimer(false);
        IsQuibZeroOpen = false;
    }
}

// Update compose timer
function UpdateComposeTime(time) {
    if (!IsIntervalTimeUP) {
        if (!($('#txtComposeQuib').val().length > 0 || $('#image').attr('src').length > 0)) {
            if (time == 'NaN:NaN:NaN') {
                $('#BtnSave').html('QUIB ZERO');
            }
            else {
                if (ComposeQuibTime != null && ComposeQuibTime != undefined && ComposeQuibTime.length > 0)
                    time = ComposeQuibTime;
                $('#BtnSave').html(time);
                //$('#BtnSave').html($('#movieTimer').val())
            }
        }
        else {
            $('#BtnSave').html('Save');
        }
    }
}

// format timer to show quib zero or 00:00:00
function FormatTimer(IsQuibZero) {
    if (IsQuibZero) {
        // format timer and set text as 'QUIB ZERO'
        $('#movieTimer').val('QUIB ZERO');
        $('#quibTimer').val('QUIB ZERO');

        $('#movieTimer').css("font-size", "9px");
        $('#quibTimer').css("font-size", "9px");
    }
    else {
        // format timer and set text as '00:00:00' (actual time)
        $('#movieTimer').css("font-size", "15px");
        $('#quibTimer').css("font-size", "15px");
    }
}

// 10 Sec Rule
function SetQuibInterval() {
    IsIntervalTimeUP = true;
    setTimeout(function () {
        IsIntervalTimeUP = false;
        UpdateComposeTime(ConvertTimeToSeconds($('#movieTimer').val()).toString().toHHMMSS());
    }, 10000);
}