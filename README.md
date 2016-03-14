# urlModuleJS
js скрипт для работы с гет параметрами

# Конфигурация 
UrlModule.config = true | false - истина если get может содержать элементы массива (?filter[param]=val)

# Доступные методы:
	- parseUrl(href) - разбивает урл вида window.location.href на основные части protocol,host,hostname,port,pathname,search,hash. Возвращает объект.
	  исли href не указан - парсим текущую стр.
	- parseGet(get) - возвращает объект get параметров
	- removeGet(params,href) - удаляет get параметры из url. Возвращает строку.
	- addGet(href,param,value) - добавляет get параметр. Возвращает строку.
