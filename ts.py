import pandas as pd
import openpyxl
import numpy as np
from googletrans import Translator, constants
from numpy import nan

a = ''
password = 'Oksanakoren'
#token = '5895426188:AAGeesw_OVKurBcmJaNv-aUJ46t0vwYhx7M'#настоящий
token = '6779562330:AAE_d_QKj1n59lgJU_JT6s6PO4atUMlnUcM'
def func_const(n):
    a = separator(n)
    return a
def separator(n):
    match n:
        case 'Понедельник': return r'sch_pn.xlsx'
        case 'Вторник': return r'sch_vt.xlsx'
        case 'Среда': return r'sch_sr.xlsx'
        case 'Четверг': return r'sch_chtg.xlsx'
        case 'Пятница': return r'sch_pt.xlsx' 
#
    
def slicer(n,path):
    op = pd.read_excel(func_const(path))
    
    #return print(op.iloc[:, :n+1])
    print(op.head())
    new_op = pd.DataFrame(op, columns=["Урок",n])
    temp_op = new_op
    print(temp_op)
    result =[]
    for index in temp_op.index:
        y = temp_op['Урок'][index], temp_op[n][index]
        #y = [x for x in y[n][index] if str(x) != 'nan']

        result.append(y)
    new = [i for i in result if nan not in i]
    #result.insert(0,("Урок","Предмет"))
    return new
def imagine():
    res = []
    citates = pd.read_excel("quotes_ex.xlsx")
    citates = pd.DataFrame(citates)
    y = citates.take(np.random.permutation(len(citates))[:1])
    for index in y.index:
        res = y['Author'][index],y['Quote'][index]
    result = ",".join(res)
    return result

def slicer_teach(n,path):
    result_name =[]
    result_predm =[]
    op = pd.read_excel(func_const(path))
    op= op.iloc[: , :]
    #print(op)
    df = op.melt(id_vars=['Урок'], value_vars=['5А','5А.1','5А.2','5Б','5Б.1','5Б.2','5В','5В.1','5В.2','6А','6А.1','6А.2','6Б','6Б.1','6Б.2','6В','6В.1','6В.2','6Г','6Г.1','6Г.2','7A','7A.1','7A.2','7Б','7Б.1','7Б.2','7В','7В.1','7В.2','7Г','7Г.1','7Г.2','8A','8A.1','8A.2','8Б','8Б.1','8Б.2','8В','8В.1','8В.2','8Г','8Г.1','8Г.2','9А','9А.1','9А.2','9Б','9Б.1','9Б.2','9B','9B.1','9B.2','10Б','10Б.1','10Б.2','10A','10A.1','10A.2','11А','11А.1','11А.2'])
    
    df2 = df.loc[df['value'] == n].sort_values(by=['Урок',"variable"])
    for index in df2.index:
        res = df2['Урок'][index],df2['variable'][index]
        result_name.append(res)
    
    return result_name
print(slicer('10A','Четверг'))
       



