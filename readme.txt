v.1.0.1
- частично сверстана главная страница, размещено дерево и элементы. bнтерактива пока никакого нет.

05.09.23
v.1.0.2
- добавлена кнопка включения вспомогательных элементов для 3д и реализовано их свободное перемещение по странице для дальнейшего удобства настройки положения дерева и камер


13.09.23
v.1.0.3
- сырая версия с недоделанным locomotive scroll и сомнениями что стоит продолжать или поискать другое решение или подход 

14.09.23
v.1.0.4
- убрал локомотив, прикрутил gscroll, вроде попроще пока. 
- сделяль пин hero, для плавности
- добавил нулевую пустую секцию для стартового скролла к началу (концу лол)
- добавил еще 2 секции, пока пустых, только прописал анимации дерева.
- понял что нужны мягкие якоря в начале кждой секции, иначе с мягким скроллом gscroll проезжаем вообще все  мимо.

15.09.23
v.1.0.5
- настроил gscroll
- добавил пустых секций нужное количество, настроил анимации дерева
- понял что плавный скролл в моем проекте не подходит. нужен fullpage scroll, буду убирать gscroll и пробовать fullpage

30.09.23
v.1.1.1
- подключена и настроена библиотека fullpage.js, коммерческая версия
- настроены анимации 3д для всех секций, координаты выненсены в отдельный объект
- в целом переработана структура, изменены связи и файлы
- настроена кнопка включения вспомогательных полец ввода данных для 3д сцены

02.10.23
v.1.1.2
- добавил скрипт который слегка вращает камеру относительно объекта в зависимости от положения мыши на экране, но столкнлся с тем что при заврешении анимации возникает сильный скачок и портир всю малину. 
- оставляю эту версию тут и буду пробовать другой подход

16.10.20
v.1.1.3
- добавлена секция services с анимациями на входах сверху/снизу и выходе
- временно отключена функция наклона камеры по курсору в секции
- начат дизайн секции кейсов:
- добавлены две точки-сферы на дерево, сделан ховер и подготовлен клик
- на одной точке настроен клик открытия закрытия, запрет смены слайдов
- начат дизайн кейса Гимназия - есть вопросики по шрифтам подзаголовков