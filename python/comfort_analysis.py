from datetime import datetime, timedelta
from comfort_score import comfort_score

# get time frame for query
now = datetime.utcnow()
end_datetime = now - timedelta(microseconds=now.microsecond)
start_datetime = end_datetime - timedelta(hours=1)

comfort_json = comfort_score(str(start_datetime), str(end_datetime))
print(comfort_json)