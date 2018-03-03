def air_quality_score(co2, co, af, pa, voc):
    from scipy.special import expit

    # assumptions
    # https://www.ashrae.org/File%20Library/docLib/.../TC-04-03-FAQ-35.pdf

    # weight parameter
    w = 30

    # co2
    # curve params:    co2_min = 400 --> 4    co2_max = 1200 --> -1
    co2_linearized = -0.00625*co2 + 6.5
    co2_score = (expit(co2_linearized))

    # co
    # http://healthycanadians.gc.ca/publications/healthy-living-vie-saine/carbon-monoxide-carbone/index-eng.php
    # curve params:    co_min = 0 --> 4    co_max = 25 --> -4
    co_linearized = -0.32*co/4 + 4.0
    co_score = (expit(co_linearized))

    # voc
    # curve params:    voc_min = 400 --> 4    voc_max = 1600 --> -4
    voc_linearized = -0.0066667*co + 6.66667
    voc_score = (expit(voc_linearized))

    # compute air_quality_score
    air_quality_score = w*min(co2_score, co_score, voc_score)

    return air_quality_score