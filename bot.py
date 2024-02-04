import telebot
from telebot import types
import os
import pandas as pd
from ts import slicer,imagine

bot = telebot.TeleBot('5895426188:AAGeesw_OVKurBcmJaNv-aUJ46t0vwYhx7M')
day_of_week = ""
password = '!botcheck56'
@bot.message_handler(commands=['start'])  
def start(message):   
        markup = types.ReplyKeyboardMarkup(row_width=3)
        pn = types.InlineKeyboardButton('Понедельник',callback_data='pn')
        vt = types.InlineKeyboardButton('Вторник',callback_data='vt')
        sr = types.InlineKeyboardButton('Среда',callback_data='sr')
        cht = types.InlineKeyboardButton('Четверг',callback_data='cht')
        pt = types.InlineKeyboardButton('Пятница',callback_data='pt')
        markup.add(pn,vt,sr,cht,pt)  
        bot.send_message(message.chat.id,'День недели:',reply_markup=markup)
        @bot.message_handler(content_types=['text'])  
        def day(message):
            global day_of_week  
            day_of_week = message.text
                
        bot.register_next_step_handler(message, day)
        bot.register_next_step_handler(message, button)


@bot.message_handler(commands=['admin']) 
def admin(message):
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
        
    
    bot.register_next_step_handler(message,check)


@bot.message_handler(content_types=['text'])
def day_admin(message):   
    markup = types.ReplyKeyboardMarkup(row_width=3)
    pn = types.InlineKeyboardButton('Понедельник',callback_data='pn')
    vt = types.InlineKeyboardButton('Вторник',callback_data='vt')
    sr = types.InlineKeyboardButton('Среда',callback_data='sr')
    cht = types.InlineKeyboardButton('Четверг',callback_data='cht')
    pt = types.InlineKeyboardButton('Пятница',callback_data='pt')
    markup.add(pn,vt,sr,cht,pt)  
    bot.send_message(message.chat.id,'День недели:',reply_markup=markup)                
    
    bot.register_next_step_handler(message,seq)


@bot.message_handler(content_types=['document'])   
def handle_docs_audio(message):
    chat_id = message.chat.id
    print(message.document)
    global file_info
    file_info = bot.get_file(message.document.file_id)
     
def seq(message):
    global day_of_week
    day_of_week = message.text
    if message.text=="Понедельник":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_pn.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        os.system('docker cp sch_pn.xlsx bot:/sch_pn.xlsx')
        bot.reply_to(message, "Пожалуй, я сохраню это")
    elif message.text=="Вторник":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_vt.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        bot.reply_to(message, "Пожалуй, я сохраню это")
    elif message.text=="Среда":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_sr.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        bot.reply_to(message, "Пожалуй, я сохраню это")
    elif message.text=="Четверг":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_cht.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        bot.reply_to(message, "Пожалуй, я сохраню это")
    elif message.text=="Пятница":
        downloaded_file = bot.download_file(file_info.file_path)
        src = r'sch_pt.xlsx'
        with open(src, 'wb') as new_file:
            new_file.write(downloaded_file)
        bot.reply_to(message, "Пожалуй, я сохраню это")
    bot.register_next_step_handler(message,start)


@bot.callback_query_handler(func=lambda message:True)
def button(message):
        markup = types.ReplyKeyboardMarkup(row_width=3)
        item7a = types.InlineKeyboardButton('7A',callback_data='7A')
        item7b = types.InlineKeyboardButton('7Б',callback_data='7b')
        item7v = types.InlineKeyboardButton('7В',callback_data='7v')
        item7g = types.InlineKeyboardButton('7Г',callback_data='7g')
        item8a = types.InlineKeyboardButton('8A',callback_data='8a')
        item8b = types.InlineKeyboardButton('8Б',callback_data='8b')
        item8v = types.InlineKeyboardButton('8В',callback_data='8v')
        item8g = types.InlineKeyboardButton('8Г',callback_data='8g')
        item9a = types.InlineKeyboardButton('9А',callback_data='9a')
        item9b = types.InlineKeyboardButton('9Б',callback_data='9b')
        item9v = types.InlineKeyboardButton('9B',callback_data='9v')
        item10a = types.InlineKeyboardButton('10A',callback_data='10a')
        item10b = types.InlineKeyboardButton('10Б',callback_data='10b')
        item11a = types.InlineKeyboardButton('11А',callback_data='11a')
        #item11b = types.InlineKeyboardButton('11Б',callback_data='11b')
        markup.add(item7a,item7b,item7v,item7g,item8a,item8b,item8v,item8g,item9a,item9b,item9v,item10a,item10b,item11a)
        bot.send_message(message.chat.id,'Класс:',reply_markup=markup)
        bot.register_next_step_handler(message, callback)
    

@bot.callback_query_handler(func=lambda call:True)
def callback(call):
        if call:
            if call.text == '7A':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '7Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '7В':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7В")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '7Г':
                chat_id = call.chat.id
                bot.send_message(chat_id,"7Г")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '8А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '8Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '8В':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8В")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine())
            elif call.text == '8Г':
                chat_id = call.chat.id
                bot.send_message(chat_id,"8Г")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '9А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '9Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '9В':
                chat_id = call.chat.id
                bot.send_message(chat_id,"9В")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '10А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"10А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res) 
                bot.send_message(chat_id,imagine())
            elif call.text == '10Б':
                chat_id = call.chat.id
                bot.send_message(chat_id,"10Б")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine()) 
            elif call.text == '11А':
                chat_id = call.chat.id
                bot.send_message(chat_id,"11А")
                for _,text in slicer(call.text,day_of_week):
                    
                    res = str(_) + " " + str(text)
                    bot.send_message(chat_id,res)
                bot.send_message(chat_id,imagine()) 
            
        markup = types.ReplyKeyboardMarkup(row_width=3) 
        global bug
        bug = types.InlineKeyboardButton('Еще разок',callback_data='bug')
        markup.add(bug)
        msg = bot.send_message(call.chat.id,"Заново?",reply_markup=markup)    
        bot.register_next_step_handler(msg, start)

if __name__ =="__main__":
    bot.polling()    