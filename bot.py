import telebot
from telebot import types
import os
import pandas as pd
from ts import slicer,imagine,token,password,slicer_teach,actual
from time import sleep
import datetime 
from datetime import date
import pytz
from dateutil.tz import gettz


bot = telebot.TeleBot('1771064619:AAEiP3XGpTL1JVdxBcSjBcvPHZx14A0IJRU')
day_of_week = ""

obj = datetime.datetime.now(gettz("Asia/Vladivostok"))
obj = obj.weekday()
 

week_d = ["Понедельник","Вторник","Среда","Четверг","Пятница","Уроков нет","Уроков нет"]
@bot.message_handler(commands=['start']) 
def select(message):
    full_name = f'Привет, <u>{message.from_user.first_name} {message.from_user.last_name}</u>,Сегодня <u>{week_d[obj]}</u>, выбери команду /day чтобы посмотреть расписание для ученика, или /teacher, чтобы посмотреть расписание для учителя .'
    bot.send_message(message.chat.id, full_name, parse_mode='html')

def day_week(message): 
    markup = types.ReplyKeyboardMarkup(row_width=3)
    pn = types.InlineKeyboardButton('Понедельник',callback_data='pn')
    vt = types.InlineKeyboardButton('Вторник',callback_data='vt')
    sr = types.InlineKeyboardButton('Среда',callback_data='sr')
    cht = types.InlineKeyboardButton('Четверг',callback_data='cht')
    pt = types.InlineKeyboardButton('Пятница',callback_data='pt')
    markup.add(pn,vt,sr,cht,pt)  
    bot.send_message(message.chat.id,'День недели:',reply_markup=markup)
    if message.text == '/day':
        @bot.message_handler(content_types=['text']) 
        def cont_day(message):
            bot.register_next_step_handler(message,day)
        cont_day(message)
    elif message.text =='/teacher':
        @bot.message_handler(content_types=['text']) 
        def cont_teacher(message):
            bot.register_next_step_handler(message,teacher_erorr)
        cont_teacher(message)


@bot.message_handler(commands=['day'])  
def start(message):
    day_week(message)
def day(message):
    if message.text == 'Понедельник'or message.text == 'Вторник' or message.text =='Среда' or message.text =='Четверг' or message.text =='Пятница':
        
        global day_of_week  
        day_of_week = message.text
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
        id7a = types.InlineKeyboardButton('7A',callback_data='7A')
        id7b = types.InlineKeyboardButton('7Б',callback_data='7b')
        id7v = types.InlineKeyboardButton('7В',callback_data='7v')
        id7g = types.InlineKeyboardButton('7Г',callback_data='7g')
        id8a = types.InlineKeyboardButton('8A',callback_data='8a')
        id8b = types.InlineKeyboardButton('8Б',callback_data='8b')
        id8v = types.InlineKeyboardButton('8В',callback_data='8v')
        id8g = types.InlineKeyboardButton('8Г',callback_data='8g')
        id9a = types.InlineKeyboardButton('9А',callback_data='9a')
        id9b = types.InlineKeyboardButton('9Б',callback_data='9b')
        id9v = types.InlineKeyboardButton('9B',callback_data='9v')
        id10a = types.InlineKeyboardButton('10A',callback_data='10a')
        id10b = types.InlineKeyboardButton('10Б',callback_data='10b')
        id11a = types.InlineKeyboardButton('11А',callback_data='11a')
        
        
        #id11b = types.InlineKeyboardButton('11Б',callback_data='11b')
        markup.add(id7a,id7b,id7v,id7g,id8a,id8b,id8v,id8g,id9a,id9b,id9v,id10a,id10b,id11a)
        
        bot.send_message(message.chat.id,'Класс:',reply_markup=markup)
        bot.register_next_step_handler(message, callback) 
    else:  
        # markup1 = types.ReplyKeyboardMarkup(row_width=3) 
        # er_or = types.InlineKeyboardButton('Заново',callback_data='repeat')
        # markup1.add(er_or)
        bot.send_message(message.chat.id,"Неверно введен день недели, введите команду /day ")
        bot.register_next_step_handler(message,select)
            
@bot.message_handler(commands=['teacher'])  
def teacher_day(message):
    day_week(message)
     
def teacher_erorr(message):
    #message.text = message.text[:-1]
    
    if message.text == 'Понедельник'or message.text == 'Вторник' or message.text =='Среда' or message.text =='Четверг' or message.text =='Пятница':
        
        global day_of_week  
        day_of_week = message.text
        
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
        id0 = types.InlineKeyboardButton('Паранько',callback_data='Паранько')
        id1 = types.InlineKeyboardButton('Баженова',callback_data='Баженова')
        id2 = types.InlineKeyboardButton('Толмачева',callback_data='Толмачева')
        id3 = types.InlineKeyboardButton('Гарбузова',callback_data='Гарбузова')
        id4 = types.InlineKeyboardButton('Дзыгун',callback_data='Дзыгун')
        id5 = types.InlineKeyboardButton('Гредякина',callback_data='Гредякина')
        id6 = types.InlineKeyboardButton('Розамаскин',callback_data='Розамаскин')
        id7 = types.InlineKeyboardButton('Петровская',callback_data='Петровская')
        id8 = types.InlineKeyboardButton('Кононенко',callback_data='Кононенко')
        id9 = types.InlineKeyboardButton('Ким',callback_data='Ким')
        id10 = types.InlineKeyboardButton('Бекжанова',callback_data='Бекжанова')
        id11 = types.InlineKeyboardButton('Меселова',callback_data='Меселова')
        id12 = types.InlineKeyboardButton('Курочкина',callback_data='Курочкина')
        id13 = types.InlineKeyboardButton('Горявина',callback_data='Горявина')
        id14 = types.InlineKeyboardButton('Недбайлова',callback_data='Недбайлова')
        id15 = types.InlineKeyboardButton('Шабалин',callback_data='Шабалин')
        id16 = types.InlineKeyboardButton('Васильченко',callback_data='Васильченко')
        id17 = types.InlineKeyboardButton('Ни',callback_data='Ни')
        id18 = types.InlineKeyboardButton('Книга',callback_data='Книга')
        id19 = types.InlineKeyboardButton('Скрыльникова',callback_data='Скрыльникова')
        id20 = types.InlineKeyboardButton('Чаплыгина',callback_data='Чаплыгина')
        id21 = types.InlineKeyboardButton('Турищева',callback_data='Турищева')
        id22 = types.InlineKeyboardButton('Кушнерева',callback_data='Кушнерева')
        id23 = types.InlineKeyboardButton('Гладкова',callback_data='Гладкова')
        id24 = types.InlineKeyboardButton('Грибовский',callback_data='Грибовский')
        id25 = types.InlineKeyboardButton('Зименко',callback_data='Зименко')
        id26 = types.InlineKeyboardButton('Колоткина',callback_data='Колоткина')
        id27 = types.InlineKeyboardButton('Шауро',callback_data='Шауро')
        id28 = types.InlineKeyboardButton('Степаненко',callback_data='Степаненко')
        #id29 = types.InlineKeyboardButton('Гредякина',callback_data='Гредякина')
        
        
        
        markup.add(id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id0,id11,id12,id13,id14,id15,id16,id17,id18,id19,id20,id21,id22,id23,id24,id25,id26,id27,id28)
        
        bot.send_message(message.chat.id,'Учитель:',reply_markup=markup)
        bot.register_next_step_handler(message, callback_teacher)
    else:  
        markup1 = types.ReplyKeyboardMarkup(row_width=3) 
        er_or = types.InlineKeyboardButton('Заново',callback_data='repeat1')
        markup1.add(er_or)
        bot.send_message(message.chat.id,"Неверно день недели",reply_markup=markup1)
        bot.register_next_step_handler(message,day_week)
    




@bot.message_handler(commands=['admin']) 
def admin(message):
    if message.text!='/admin':
        bot.register_next_step_handler(message,select)
    else:
        bot.send_message(message.chat.id,'Введите пароль:')
        @bot.message_handler(content_types=['text'])
        def check(message):
            if message.text == password:
                bot.reply_to(message,"Успешно")
                bot.reply_to(message,"Загрузите файл")
                bot.register_next_step_handler(message,handle_docs_audio)
                bot.register_next_step_handler(message,day_admin)
            else:
                bot.send_message(message.chat.id,'Неверный пароль')
                bot.register_next_step_handler(message,admin)
            
        
        bot.register_next_step_handler(message,check)


@bot.message_handler(content_types=['admin'])
def day_admin(message):   
    markup = types.ReplyKeyboardMarkup(row_width=3)
    pn = types.InlineKeyboardButton('Понедельник!',callback_data='pn')
    vt = types.InlineKeyboardButton('Вторник!',callback_data='vt')
    sr = types.InlineKeyboardButton('Среда!',callback_data='sr')
    cht = types.InlineKeyboardButton('Четверг!',callback_data='cht')
    pt = types.InlineKeyboardButton('Пятница!',callback_data='pt')
    markup.add(pn,vt,sr,cht,pt)  
    bot.send_message(message.chat.id,'День недели:',reply_markup=markup)
             
    
    bot.register_next_step_handler(message,seq)


@bot.message_handler(content_types=['document'])   
def handle_docs_audio(message):
    chat_id = message.chat.id
    print(message.document)
    global file_info
    file_info = bot.get_file(message.document.file_id)
current_date_pn =""
current_date_vt =""
current_date_sr =""
current_date_cht =""
current_date_pt =""
current_date = [current_date_pn,current_date_vt,current_date_sr,current_date_cht,current_date_pt]     
def seq(message):
    global day_of_week
    day_of_week = message.text
    if message.text=="Понедельник!":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_pn.xlsx'
        current_date[0] = datetime.datetime.now(gettz("Asia/Vladivostok")).strftime('%d, %b, %Y, в %H:%M')
         
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_pn.xlsx bot:/sch_pn.xlsx')
        bot.reply_to(message, f"Спасибо, сохранил! Актуально на {current_date[0]}")
        bot.register_next_step_handler(message,select)
    
    elif message.text=="Вторник!":
        downloaded_file = bot.download_file(file_info.file_path)
        current_date[1] = datetime.datetime.now(gettz("Asia/Vladivostok")).strftime('%d, %b, %Y, в %H:%M')
        
        src = r'sch_vt.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_vt.xlsx bot:/sch_vt.xlsx')    
        bot.reply_to(message, f"Спасибо, сохранил! Актуально на {current_date[1]}")
        bot.register_next_step_handler(message,select)
    
    elif message.text=="Среда!":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_sr.xlsx'
        current_date[2] = datetime.datetime.now(gettz("Asia/Vladivostok")).strftime('%d, %b, %Y, в %H:%M')
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_sr.xlsx bot:/sch_sr.xlsx')
        bot.reply_to(message, f"Спасибо, сохранил! Актуально на {current_date[2]}")
        bot.register_next_step_handler(message,select)
    
    elif message.text=="Четверг!":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_cht.xlsx'
        current_date[3] = datetime.datetime.now(gettz("Asia/Vladivostok")).strftime('%d, %b, %Y, в %H:%M')
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_cht.xlsx bot:/sch_cht.xlsx')
        bot.reply_to(message, f"Спасибо, сохранил! Актуально на {current_date[3]}")
        bot.register_next_step_handler(message,select)
    
    elif message.text=="Пятница!":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_pt.xlsx'
        current_date[4] = datetime.datetime.now(gettz("Asia/Vladivostok")).strftime('%d, %b, %Y, в %H:%M')
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_pt.xlsx bot:/sch_pt.xlsx')
        print(current_date_pt)       
        bot.reply_to(message, f"Спасибо, сохранил! Актуально на {current_date[4]}")
        bot.register_next_step_handler(message,select)
    @bot.message_handler(content_types=['text'])
    def outer(message): 
        if message.text == '/start':
            bot.send_message(message.chat.id,"Введите команду /start, чтобы проверить загруженное расписание.")
            bot.register_next_step_handler(message,select)
@bot.callback_query_handler(func=lambda call:True)
def callback_teacher(call):
    if call:
        global lastname
        lastname = ''
        match call.text:
            case 'Паранько': lastname = 'Паранько'
            case 'Баженова': lastname = 'Баженова'
            case 'Толмачева': lastname = 'Толмачева'
            case 'Гарбузова': lastname = 'Гарбузова'
            case 'Дзыгун': lastname = 'Дзыгун'
            case 'Гредякина': lastname = 'Гредякина'
            case 'Розамаскин': lastname = 'Розамаскин'
            case 'Петровская': lastname = 'Петровская'
            case 'Кононенко': lastname = 'Кононенко'
            case 'Ким': lastname = 'Ким'
            case 'Бекжанова': lastname = 'Бекжанова'
            case 'Меселова': lastname = 'Меселова'
            case 'Курочкина': lastname = 'Курочкина'
            case 'Горявина': lastname = 'Горявина'
            case 'Недбайлова': lastname = 'Недбайлова'
            case 'Шабалин': lastname = 'Шабалин'
            case 'Васильченко': lastname = 'Васильченко'
            case 'Ни': lastname = 'Ни'
            case 'Книга': lastname = 'Книга'
            case 'Скрыльникова': lastname = 'Скрыльникова'
            case 'Чаплыгина': lastname = 'Чаплыгина'
            case 'Турищева': lastname = 'Турищева'
            case 'Кушнерева': lastname = 'Кушнерева'
            case 'Гладкова': lastname = 'Гладкова'
            case 'Грибовский': lastname = 'Грибовский'
            case 'Зименко': lastname = 'Зименко'
            case 'Колоткина': lastname = 'Колоткина'
            case 'Шауро': lastname = 'Шауро'
            case 'Степаненко': lastname = 'Степаненко'
        chat_id = call.chat.id
        bot.send_message(chat_id,lastname)
        for _,text in slicer_teach(call.text,day_of_week):
             
            res = str(_) + " " + str(text[:-2])
            
            bot.send_message(chat_id,res)
        bot.send_message(chat_id,f'<tg-spoiler>{imagine()}</tg-spoiler>',parse_mode='html')
        bot.send_message(chat_id,actual(day_of_week,current_date))
        bot.send_message(chat_id,"Чтобы вернуться в начало напишите команду /start")
        bot.register_next_step_handler(call,select)
    

@bot.callback_query_handler(func=lambda call:True)
def callback(call):
        if call:
            #print(call.text)
            if call.text == '7A':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7A")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '7Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '7В':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7В")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '7Г':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7Г")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '8A':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8A")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '8Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '8В':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8В")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '8Г':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8Г")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '9А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '9Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '9B':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9B")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            elif call.text == '10A':
                chat_id = call.chat.id
                bot.send_message(chat_id,"10A")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date)) 
            elif call.text == '10Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"10Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date)) 
            elif call.text == '11А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"11А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                
                bot.send_message(chat_id,actual(day_of_week,current_date))
            bot.send_message(chat_id,f'<tg-spoiler>{imagine()}</tg-spoiler>',parse_mode='html')
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
        bug1 = types.InlineKeyboardButton('Да, еще разок!',callback_data='bug1')
        markup.add(bug1)
        bot.send_message(chat_id,"Чтобы вернуться в начало напишите команду /start")
        bot.register_next_step_handler(call,select)



        
if __name__ =="__main__":
    while True:
        try:
            bot.polling(none_stop=True)
        except Exception as _ex:
            print(_ex)
            sleep(15) 