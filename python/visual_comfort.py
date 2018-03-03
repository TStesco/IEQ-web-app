def visual_comfort_score(lux):
    from scipy.special import expit

    # assumptions
    # lux_target from: http://www.cibse.org/getmedia/3b3cba92-f3cc-4477-bc63-8c02fc31472c/EN12464-2011.pdf.aspx
    # http://www.tnb.ca/en/brands/lumacell/files/3LU_Building_Code_EN.pdf
    # http://laws-lois.justice.gc.ca/eng/regulations/SOR-86-304/page-9.html#h-66

    # weight parameter
    w = 20

    # curve params:    lux_min = 1000 --> 2    lux_max = 300 --> -2
    lux_linearized = 0.0057143*lux - 3.7143

    # compute visual_comfort_score
    visual_comfort_score = (expit(lux_linearized))*w

    # compute visual_comfort_score
    return visual_comfort_score
