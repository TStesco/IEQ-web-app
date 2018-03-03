def thermal_comfort_score(ta,rh, af):
    import numpy
    from scipy.special import expit

    # inputs
    TA = ta  # Air temperature (°C)
    RH = rh  # Relative humidity %

    # assumptions
    CLO = 1.0  # Clothing (clo)
    MET = 1.2  # Metabolic rate (met)
    WME = 0  # External work, normally around 0 (met)
    TR = TA-1  # Mean radiant temperature (°C)
    VEL = 0.1  # Relative air velocity (m/s)
    PA = RH * 10 * numpy.exp((16.6536-4030.183/(TA+235)))  # compute water partial pressure
    ICL = 0.155 * CLO  # thermal insulation of the clothing in m 2 K/W
    M = MET * 58.15  # metabolic rate in W/m 2
    W = WME * 58.15  # external work in W/m 2
    MW = M-W  # internal heat production in the human body

    # clothing area factor
    if ICL <= 0.078:
        FCL = 1 + 1.29 * ICL
    else:
        FCL = 1.05 + 0.645 * ICL

    # heat transfer coeff. by forced convection
    HCF = 12.1 * numpy.sqrt(VEL)

    # solve for TCL and HC iteratively
    TCL0 = TA + (35.5-TA)/(3.5 * ICL + 0.1) #first guess for surface temperature of clothing (C)
    TCL1 = TCL0
    HC = 0
    N = 0
    while (N < 1000):
        N = N +1
        TCL0 = abs(TCL1 + TCL0)/2
        HCN =2.38 * abs(TCL0-TA)**0.25 # heat transfer coeff by natural convection
        if HCF>HCN:
            HC = HCF
        else:
            HC = HCN
        TCL1 = 35.7-0.028*(MW)-ICL*(3.96*10**-8*FCL*((TCL0+273.13)**4-(TR+273.13)**4)+FCL*HC*(TCL0-TA))
    TCL = TCL1

    # solve for Predicted Mean Vote (PMV)
    PMV_f = (0.303*numpy.exp(-0.036*M)+0.028)
    PMV_1 = (M-W)-3.05*10**-3*(5733-6.99*(MW)-PA)-0.42*((MW)-58.15)
    PMV_2 = -1.7*10**-5*M*(5867-PA)-0.0014*M*(34-TA)
    PMV_3 = -3.96*10**-8*FCL*((TCL+273.13)**4-(TR+273.13)**4)-FCL*HC*(TCL-TA)
    PMV = PMV_f*(PMV_1+PMV_2+PMV_3)

    # solve for Predicted Percent Dissatisfied (PPD)
    PPD = 100 - 95*numpy.exp(-0.03353*PMV**4-0.2179*PMV**2)

    #compute thermal score
    thermal_comfort_score = 30*(PPD/100)

    # weight parameter
    w = 30

    # curve params:    PPD_min = 6 --> 4    PPD_max = 60 --> -1
    thermal_linearized = -0.0926*PPD + 4.5556
    thermal_comfort_score = (expit(thermal_linearized))

    return thermal_comfort_score