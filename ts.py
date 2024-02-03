import pandas as pd
import openpyxl
import numpy as np
a = ''
def func_const(n):
    a = separator(n)
    return a
def separator(n):
    match n:
        case 'Понедельник': return r'C:\Users\curvh\Documents\bot\sch_pn.xlsx'
        case 'Вторник': return r'C:\Users\curvh\Documents\bot\sch_vt.xlsx'
        case 'Среда': return r'C:\Users\curvh\Documents\bot\sch_sr.xlsx'
        case 'Четверг': return r'C:\Users\curvh\Documents\bot\sch_cht.xlsx'
        case 'Пятница': return r'C:\Users\curvh\Documents\bot\sch_pt.xlsx' 

def slicer(n,path):
    op = pd.read_excel(func_const(path))
    
    #return print(op.iloc[:, :n+1])
     
    new_op = pd.DataFrame(op, columns=["Урок",n])
    temp_op = new_op
    result =[]
    for index in temp_op.index:
        y = temp_op['Урок'][index], temp_op[n][index]
        result.append(y)
    #result.insert(0,("Урок","Предмет"))
    return result
def imagine():
    res = []
    citates = pd.read_excel("quotes_ex.xlsx")
    citates = pd.DataFrame(citates)
    y = citates.take(np.random.permutation(len(citates))[:1])
    for index in y.index:
        res = y['Author'][index],y['Quote'][index]
    result = ",".join(res)
    return result


