const robotData = require("./data");

function totalRate(shift) {

    let totalMinObj = totalMinutes(shift) // { standardDay: 0, standardNight: 0, extraDay: 0, extraNight: 0 }
    
    let output = 0
    Object.keys(totalMinObj).forEach(function(key) {
        let shiftType = key
        let shiftTypeHr = totalMinObj[key] // 
        let shiftValue = robotData[shiftType]["value"]

        output += (shiftTypeHr) * shiftValue * 60
    });
    
    return output

}

function totalMinutes(shift) {

    // separating date and time for start and end
    let start = shift['start'].split("T")
    let end = shift['end'].split('T')

    // making the date into a list and converting to int
    let start_date = start[0].split('-')
    start_date = start_date.map((i) => Number(i))
    let end_date = end[0].split('-')
    end_date = end_date.map((i) => Number(i))

    // date time values
    let start_day = start_date[2] 
    let start_month = start_date[1] 
    let end_day = end_date[2] 
    let end_month = end_date[1] 

    let start_time = start[1].split(":").slice(0, 2).join('')
    start_time = Number(start_time)
    let end_time = end[1].split(":").slice(0, 2).join('')
    end_time = Number(end_time)

    // counters (in hours)
    let morning_weekday_count = 0
    let night_weekday_count = 0
    let morning_weekend_count = 0
    let night_weekend_count = 0

    const weekend_arr = [6, 7, 13, 14, 20, 21, 27, 28]

    let truth = true

    /*
    logic structure:

    while true
        if weekend
            if morning
            if night
        else if not weekend
            if morning
            if night
        if start == end # after count finish
            truth = False
    */

    while (truth) {

        // check if weekend
        if (weekend_arr.includes(start_day)) {
            // check if morning
            if (700 <= start_time && start_time < 2300) {
                // checking for minutes
                if (start_time == 0) {
                    // pass
                } else {
                    let minutes = start_time.toString()
                    minutes = minutes.slice(-2)
                    minutes = Number(minutes)
                    if (minutes != 00) {
                        let min_left_to_next_hr = 60 - minutes
                        start_time += min_left_to_next_hr + 40 // making it the next hour
                        morning_weekend_count += min_left_to_next_hr/60
                    }
                }
                // Moving clock to the next hour / day / month
                if (start_time != 2400) {
                    start_time += 100
                    morning_weekend_count += 1
					// accounting for breaks
					if (morning_weekend_count % 8 == 0 && start_time != end_time) {
						start_time += 100
					}
                }
                if (start_time == 2400) {
                    start_time = 0
                    start_day += 1
                }
                if (start_day == 28) {
                    start_day = 1
                    start_month += 1
                }
            }

            // check if night
            else if (start_time >= 2300 || 0 <= start_time && start_time < 700) {
                
                // checking for minutes
                if (start_time == 0) {
                    // pass
                } else {
                    let minutes = start_time.toString()
                    minutes = minutes.slice(-2)
                    minutes = Number(minutes)
                    if (minutes != 00) {
                        let min_left_to_next_hr = 60 - minutes
                        start_time += min_left_to_next_hr + 40 // making it the next hour 2400
                        night_weekend_count += min_left_to_next_hr/60
                    }
                }
        
                // Moving clock to the next hour / day / month
                if (start_time != 2400) {
                    start_time += 100
                    night_weekend_count += 1
					// accounting for breaks
					if (night_weekend_count % 8 == 0 && start_time != end_time) {
						start_time += 100
					}
                }
                if (start_time == 2400) {
                    start_time = 0
                    start_day += 1
                }
                if (start_day == 28) {
                    start_day = 1
                    start_month += 1
                }
            }

        } 
        // check if weekday
        else {

            // check if morning
            if (700 <= start_time && start_time < 2300) {

                // checking for minutes
                if (start_time == 0) {
                    // pass
                } 
                else {
                    let minutes = start_time.toString()
                    minutes = minutes.slice(-2)
                    minutes = Number(minutes)
                    if (minutes != 00) {
                        let min_left_to_next_hr = 60 - minutes
                        start_time += min_left_to_next_hr + 40 // making it the next hour
                        morning_weekday_count += min_left_to_next_hr/60
                    }
                }

                // Moving clock to the next hour / day / month
                if (start_time != 2400) {
                    start_time += 100
                    morning_weekday_count += 1
					// accounting for breaks
					if (morning_weekday_count % 8 == 0 && start_time != end_time) {
						start_time += 100
					}
                }
                if (start_time == 2400) {
                    start_time = 0
                    start_day += 1
                }
                if (start_day == 28) {
                    start_day = 1
                    start_month += 1
                }
            }

            // check if night
            else if (start_time >= 2300 || 0 <= start_time && start_time < 700) {
                
                // checking for minutes
                if (start_time == 0) {
                    // pass
                } else {
                    let minutes = start_time.toString()
                    minutes = minutes.slice(-2)
                    minutes = Number(minutes)
                    if (minutes != 00) {
                        let min_left_to_next_hr = 60 - minutes
                        start_time += min_left_to_next_hr + 40 // making it the next hour 2400
                        night_weekday_count += min_left_to_next_hr/60
                    }
                }
        
                // Moving clock to the next hour / day / month
                if (start_time != 2400) {
                    start_time += 100
                    night_weekday_count += 1
					// accounting for breaks
					if (night_weekday_count % 8 == 0 && start_time != end_time) {
						start_time += 100
					}
                }
                if (start_time == 2400) {
                    start_time = 0
                    start_day += 1
                }
                if (start_day == 28) {
                    start_day = 1
                    start_month += 1
                }
            }

        }

        if (start_day == end_day && start_month == end_month && start_time == end_time) {
            truth = false
        }
    }

    return {
        "standardDay": morning_weekday_count, 
        "standardNight": night_weekday_count, 
        "extraDay": morning_weekend_count, 
        "extraNight": night_weekend_count
    }
}

module.exports = totalRate;