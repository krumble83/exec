
var MenuObject = function(parent){
	if(!parent){
		this.el = document.createElement('ul');
		this.el.setAttribute('id', 'exMenu');
		document.body.appendChild(this.el);
		this.initEventHandlers();
	}
	else
		this.el = parent;
	this.el.instance = this;
}

MenuObject.prototype.initEventHandlers = function(){
	var me = this;
	this.el.addEventListener('click', function(e){
		var target = e.target.parentNode;
		if(target.getAttribute('class') == 'disabled')
			return;
		if(typeof target.callback === 'function')
			target.callback.call(me.mContext, e);
		me.close();
	});
	
	document.addEventListener('mousedown', function(e){
		if(me.el.getAttribute('class') != 'visible')
			return;
		var p = e.target;
		while(p != me.el && p)
			p = p.parentNode;
		if(!p)
			me.el.setAttribute('class', '');
	});
	return this;
}

MenuObject.prototype.clear = function(parent){
	while (this.el.firstChild) {
		this.el.removeChild(this.el.firstChild);
	};
	return this;
}

MenuObject.prototype.showAt = function(point, context){
	if(point instanceof MouseEvent)
		point = {x: point.pageX, y: point.pageY};
	this.el.style.top = point.y + 'px';
	this.el.style.left = point.x + 'px';
	this.el.setAttribute('class', 'visible');
	if(context)
		this.mContext = context;
	return this;
}

MenuObject.prototype.close = function(){
	this.el.setAttribute('class', '');
}

MenuObject.prototype.addTitleItem = function(text){
	var li = document.createElement('li');
	var a = document.createElement('a');
	a.innerHTML = text;
	li.appendChild(a);
	li.setAttribute('class', 'title');
	this.el.appendChild(li);
	return this;
}

MenuObject.prototype.addItem = function(text, id, callback){
	var li = document.createElement('li');
	var a = document.createElement('a');
	a.innerHTML = text;
	if(id)
		li.setAttribute('data-id', id);
	if(callback)
		li.callback = callback;
	li.appendChild(a);
	this.el.appendChild(li);
	return new MenuObject(li);
}

MenuObject.prototype.addSubMenu = function(text, id){
	var ul = document.createElement('ul');
	var li = document.createElement('li');
	li.setAttribute('class', 'sub');
	if(id)
		li.setAttribute('data-id', id);
	var a = document.createElement('a');
	a.innerHTML = text;
	li.appendChild(a);
	li.appendChild(ul);
	this.el.appendChild(li);
	return new MenuObject(ul);
}

MenuObject.prototype.enabled = function(enabled){
	if(enabled === true)
		this.el.setAttribute('class', '');
	else if(enabled === false)
		this.el.setAttribute('class', 'disabled');
	else{
		if(!this.el.getAttribute('class'))
			return true;
		return this.el.getAttribute('class').search('disabled') == -1;
	}
	return this;
}

MenuObject.prototype.callback = function(callback){
	if(callback)
		this.el.callback = callback;
	return this.el.callback;
}

MenuObject.prototype.sep = function(){
	var li = document.createElement('li');
	li.setAttribute('class', 'sep');
	this.el.appendChild(li);
	return this;
}

MenuObject.prototype.setMeta = function(tooltip, shortcut){
	if(tooltip && this.el.tagName == 'LI')
		this.el.setAttribute('title', tooltip);
	else if(tooltip && this.el.parentNode.tagName == 'LI')
		this.el.parentNode.setAttribute('title', tooltip);
		
	if(shortcut && this.el.tagName == 'LI')
		this.el.setAttribute('data-shortcut', shortcut);
	else if(shortcut && this.el.parentNode.tagName == 'LI')
		this.el.parentNode.setAttribute('data-shortcut', shortcut);
	return this;
}

MenuObject.prototype.getMenu = function(id){
	var ret = this.el.querySelector('[data-id="' + id + '"]');
	if(ret)
		return new MenuObject(ret);
}

loadCss('menu.css');