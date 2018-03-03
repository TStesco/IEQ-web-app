def comfort_score(start_datetime, end_datetime):

    import pandas as pd
    import mysql.connector
    import os
    import json
    import math
    from thermal_comfort import thermal_comfort_score
    from air_quality import air_quality_score
    from acoustic_comfort import acoustic_comfort_score
    from visual_comfort import visual_comfort_score


    comfort = {}

    sql_string = "select * from data where deviceID=5000000001 and created between '" + start_datetime + "' and '"
    sql_string = sql_string + end_datetime + "' order by created desc"

    try:
        cnx = mysql.connector.connect(user=os.environ['MYSQL_USER'],
                                      host=os.environ['MYSQL_HOST'],
                                      port=os.environ['MYSQL_PORT'],
                                      password=os.environ['MYSQL_PASSWORD'],
                                      database=os.environ['MYSQL_DATABASE'])
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('Something is wrong with your user name or password')
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print('Database does not exist')
        else:
            print(err)

    df_mysql = pd.read_sql(sql_string, con=cnx)
    desc= df_mysql.describe()

    if len(df_mysql)<1:
        # return unknown comfort scores
        comfort['visualComfort'] = None
        comfort['acousticComfort'] = None
        comfort['airQuality'] = None
        comfort['thermalComfort'] = None
    elif len(df_mysql)>=1:
        # compute comfort scores
        comfort['visualComfort'] = math.ceil(visual_comfort_score(desc.light[1]))
        comfort['acousticComfort'] = math.ceil(acoustic_comfort_score(desc.sound[1]))
        comfort['airQuality'] = math.ceil(air_quality_score(desc.co2[1], desc.coal[1], desc.airFlow[1], desc.pressure[1], desc.voc[1]))
        comfort['thermalComfort'] = math.ceil(thermal_comfort_score(desc.temperature[1],desc.humidity[1],desc.airFlow[1]))

    comfort_json = json.dumps(comfort)
    return comfort_json