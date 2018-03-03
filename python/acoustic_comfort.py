def acoustic_comfort_score(db):
    from scipy.special import expit

    # assumptions
    # target dB from: Acoustic Performance Measurement Protocols. ASHRAE 2011

    # weight parameter
    w = 20

    # curve params:    db_min = 25    db_max = 100
    db_linearized = -0.10667*db + 6.6667

    # compute acoustic_comfort_score
    acoustic_comfort_score = (expit(db_linearized))*w

    # compute acoustic_comfort_score
    return acoustic_comfort_score