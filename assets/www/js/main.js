function loadRss(type,contentId, page) {
	page	=	((page < 1) ? 1 : ((page > rSSPageNumber) ? rSSPageNumber : page));
	$.mobile.showPageLoadingMsg();
	//if($.trim($('#'+contentId).html()) == ''){
		headerText	=	'';
		if(type	== 'news'){
			urlRss	=	'http://dd.shalomlife.com/news/rss/';
			headerText	=	'News';
		}else if(type	== 'business'){
			urlRss	=	'http://dd.shalomlife.com/business/rss/';
			headerText	=	'Business';
		}else if(type	== 'culture'){
			urlRss	=	'http://dd.shalomlife.com/culture/rss/';
			headerText	=	'Culture';
		}else if(type	== 'health'){
			urlRss	=	'http://dd.shalomlife.com/health/rss/';
			headerText	=	'Health';
		}else{
			urlRss	=	'http://dd.shalomlife.com/rss/';
			headerText	=	'Stories';
		}
		parent	=	$('#'+contentId).parent();
		parent.empty().html('<div class="content-primary" id="'+contentId+'"></div>');
		//$('.content-primary').each(function(){ 	idThis	=	this.id; parent	=	$(this).parent(); //	$(this).remove(); //	parent.html('<div class="content-primary" id="'+idThis+'"></div>'); //});
		$.post(urlRss, {}, function(res, code) {
			var xml 	= 	$(res);
			var items 	= 	xml.find("item");				
			dataAll		=	'<li data-role="list-divider" role="heading">Lastest '+headerText+'</li>';
			beginItem	=	(page-1)*maxItemPerPage;	endItem		=	page*maxItemPerPage;
			countItem	=	0;		
			$.each(items, function(i, v) {
				countItem++;					
				if(countItem	<=	beginItem || countItem > endItem) 	return true;				
				itemLink	=	$(v).find("link").text();
				content    	=   $(v).find("description").text();				
				images    	=   content.match(/\<img(.+)alt\=\"\" \/\>/i);
				itemImage	=	'';
				if(images.length){ 
					itemImage	=	images[0];
					content		=	content.replace(/\<img(.+)alt\=\"\" \/\>/i,'');	
				}
				
				dataAll	+=	'<li data-icon="false"><a href="#" rel="'+itemLink+'" class="articleView">';						
				dataAll	+=	itemImage;
				dataAll	+=	'<h3>'+$(v).find("title").text()+'</h3>';			
				dataAll	+=	'<p>'+createStringDate($(v).find("pubDate").text())+' | ' + $(v).find("author").text()+ '</p>';
				dataAll	+=	'</a></li>';
			});
			
			$('#'+contentId).html(dataAll);
			$('#'+contentId).listview();
		});
	//}
	$.mobile.hidePageLoadingMsg();
	return true;
}

function createStringDate(pubDate){	 
	var dtDate2 		= 	pubDate.replace(/-/g,'/');
	var nDifference 	= 	Math.abs(new Date() - new Date(dtDate2));
	//alert('Difference in milliseconds ' + nDifference);
	var one_minute		=	1000*60;
	var one_hour		=	one_minute*60;
	var one_day 		= 	one_hour*24;
	var one_week		=	one_day*7;
	var one_month		=	one_day*30;
	var one_year		=	one_day*365;
	//alert('Difference in days ' + Math.floor(nDifference/one_day));
	yearNum			=	Math.floor(nDifference/one_year);
	timeText		=	'';
	if(yearNum > 0){
		timeText		=	yearNum > 0	?  (' ' + yearNum + (yearNum>1 ? ' years': ' year')) : '';	
		return timeText +=	' ago.';
	}else {
		monthNum			=	Math.floor(nDifference/one_month);
		if(monthNum > 0){
			timeText		+=	monthNum > 0	? (' ' +  monthNum + (monthNum>1 ? ' months': ' month') ): '';	
			return timeText +=	' ago.';
		}else{
			weekNum			=	Math.floor(nDifference/one_week);
			if(weekNum > 0){
				timeText		+=	weekNum > 0	? (' ' +  weekNum + (weekNum>1 ? ' weeks': ' week') ): '';	
				return timeText +=	' ago.';
			}else{
				dayNum			=	Math.floor(nDifference/one_day);
				if(dayNum > 0){
					timeText		+=	dayNum > 0	? (' ' +  dayNum + (dayNum>1 ? ' days': ' day')) : '';	
					return timeText +=	' ago.';
				}else{
					yearNum			=	Math.floor(nDifference/one_hour);
					if(yearNum > 0){
						timeText		+=	yearNum > 0	? (' ' +  yearNum + (yearNum>1 ? ' hours': ' hour') ): '';		
						return timeText +=	' ago.';
					}else{
						yearNum			=	Math.floor(nDifference/one_minute);
						if(yearNum > 0){
							timeText		+=	yearNum > 0	? (' ' +  yearNum + (yearNum>1 ? ' minutes': ' minute') ): '';
							return timeText +=	' ago.';
						}
					}
				}
			}
		}
	}	
}

function getArticleContent(ob){		
	$.mobile.showPageLoadingMsg();
	urlArticle	=	$.trim(ob.rel.replace(/(http\:\/\/.+\.shalomlife\.com)/,'$1/json'));
	$('#articleView').empty();	
	$.get(urlArticle, {},function(res, code) {
		content		=	'';
		content	+=	'<h2 style="color:#1EA4D8">'+res.title+'</h2>';
		content	+=	'<p>'+res.author+' | '+res.publish+'</p>';
		content	+=	'<p><div class="article_facebook_pane clearfix"><div class="fb-like" data-href="'+res.url+'" data-send="true" data-width="450" data-show-faces="false"></div></div></p>';
		content	+=	'<p>'+res.image+ res.content+'</p>';
		$('#articleView').html(content);
		$.mobile.changePage('#article',{ transition: "none"});
	},'json');	
	$.mobile.hidePageLoadingMsg();
	return false;
}

function submitNewsletter(){
	$.mobile.showPageLoadingMsg();
	dataSend	=	$( "form#newsletterForm" ).serialize ();				
	$.ajax({ 
		url: "http://dd.shalomlife.com/site/subscribeMobile/", 
		type:  "GET", 					
		data:  dataSend, 
		dataType:  "json",
		success: function( response ) { 
			alert(response.messages);
			if(response.error == 0){
				$.mobile.changePage('#home',{ transition: "none"});
			}
		},
		//start: function() {$.mobile.showPageLoadingMsg();},
		complete : function() {$.mobile.hidePageLoadingMsg()}
	}); 
	return false; // Prevent a form submit 
}

function submitSearch(ob, page){
	page	=	page < 1 ? 1 : page;
	searchCurrentPage	=	page;
	pageActive	=	$.mobile.activePage.attr('id');
	dataSearch	=	$('#'+pageActive+' form.searchForm input').val();	
	$('form.searchForm input').each(function(){ $(this).val(dataSearch);});
	
	dataSearch	=	dataSearch.replace(/\s+/,'+');	
	url			=	searchUrl	+	dataSearch+"/page"+page+'/';	
	$.mobile.changePage('#pageSearch',{ transition: "none"});
	$('#pageSearch form.searchForm input').val(dataSearch);
	$.mobile.showPageLoadingMsg();
	parent	=	$('#contentSearch').parent();
	parent.empty().html('<div class="content-primary" id="contentSearch"></div>');
	$.ajax({ 
		url: url, 
		type:  "GET", 					
		data:  {}, 
		dataType:  "json",
		success: function( response ,status) { 			
			dataAll		=	'<li data-role="list-divider" role="heading">Searching Results</li>';
			countItem	=	0;	nextItem	=	false;
			$.each(response, function(i,item){				
				countItem++;				
				if(countItem <= maxItemPerPage ){
					dataAll	+=	'<li data-icon="false"><a href="#" rel="'+item.url+'" class="articleView">';						
					dataAll	+=	item.image;
					dataAll	+=	'<h3>'+item.title+'</h3>';			
					dataAll	+=	'<p>'+createStringDate(item.publish)+' | ' + item.author+ '</p>';
					dataAll	+=	'</a></li>';
				}else{
					nextItem	=	true;
				}
			});		
			if(countItem == 0){
				dataAll		+=	'<li>Nothing is found.</li>';
			}
			$('#contentSearch').html(dataAll);
			$('#contentSearch').listview();
			if(nextItem){
				$('#pageSearch'+' a.snext').show();
			}else{
				$('#pageSearch'+' a.snext').hide();
			}			
		},
		error:function (xhr, ajaxOptions, thrownError){
			alert(xhr.status);
			alert(thrownError);
		} ,
		start: function() {$.mobile.showPageLoadingMsg();},
		complete : function() {$.mobile.hidePageLoadingMsg()}
	}); 
	if(page>1){
		$('#pageSearch'+' a.sprev').show();
	}else{
		$('#pageSearch'+' a.sprev').hide();
	}
	return true;
}

function searchNavigation(direction,ob){
	if(direction=='next'){
		return submitSearch(ob, searchCurrentPage+1);	
	}else{
		return submitSearch(ob, searchCurrentPage-1);	
	}	
}

function nagivationPaging(direction,ob){	
	needPage	=	direction == 'prev' ? -1 : 1;
	activePage		=	$.mobile.activePage.attr('id');
	switch(activePage){		
		case 'home':
			homeCurrentPage += needPage;
			loadRss('home','content',homeCurrentPage);			
			hidePaging(activePage, homeCurrentPage);
			break;
		case 'pageNews':
			newsCurrentPage += needPage;
			loadRss('news','contentNews',newsCurrentPage); 
			hidePaging(activePage, newsCurrentPage);
			break;
		case 'pageBusiness':
			businessCurrentPage += needPage;
			loadRss('business','contentBus',businessCurrentPage);
			hidePaging(activePage, businessCurrentPage);
			break;
		case 'pageCulture':
			cultureCurrentPage += needPage;
			loadRss('culture','contentCul',cultureCurrentPage);
			hidePaging(activePage, cultureCurrentPage);
			break;
		case 'pageHealth':
			healthCurrentPage += needPage;
			loadRss('health','contentHealth',healthCurrentPage);
			hidePaging(activePage, healthCurrentPage);
			break;
		case 'pageSearch':
			searchCurrentPage += needPage;
			break;
	}
}

function hidePaging(activePage,currentPage){
	currentPage	=	((currentPage < 1) ? 1 : ((currentPage > rSSPageNumber) ? rSSPageNumber : currentPage));
	switch(currentPage){
		case 1:
			$('#'+activePage+' a.prev').hide();
			$('#'+activePage+' a.next').show();
			break;
		/*case 2:
			$('#'+activePage+' a.prev').show();
			$('#'+activePage+' a.next').show();
			break;*/
		case rSSPageNumber:
			$('#'+activePage+' a.prev').show();
			$('#'+activePage+' a.next').hide();
			break;
		default :
			$('#'+activePage+' a.prev').show();
			$('#'+activePage+' a.next').show();
			break;
	}
}