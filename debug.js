
//console.warn('TODO: ');

//console.warn('TODO: Quand on créer un node via le librarymenu, en tirant un lien existant, si la pin target du lien est "optional", le lien n\'est pas rattaché correctement.');
//console.warn('TODO: Quand on commence a deplacer un node et qu\'on le remet a sa position initiale, une action undo/redo est créee.');
//console.warn('TODO: Dans certains cas, quand on supprime un lien dans un groupe de pin "wilcards", les pins restent sur l\'ancien dataType au lieu de revenir en wilcards.');
//console.warn('TODO: ajouter une tolerance lors d\'un click droit, si jamais on bouge la souris d\'un pixel, le menu contectuel s\'affiche pas');
console.warn('TODO: Quand on modifie le graph apres un undo, on doit détruire proprement tous les elements contenus dans la pile du redo.');
//console.warn('TODO: Ameliorer le rectangle de selection pour prendre en compte tout les point d\'un node.');
//console.warn('TODO: Quand on cree un lien, verifier q\'un lien identique n\'existe pas deja (meme pins)');
console.warn('TODO: deplacer la fonction snap toGrid de facon a l\'executer auto qd ajout noeud');
console.warn('TODO: les reroute node ne fonctionnent pas avec les DataTypes en mode Array et dans certains cas avec le ExecDatatType');
//console.warn('TODO: lors de l\'export de noeud, exporter les liens avec');
//console.warn('TODO: les rerouteNode ne sont pas correctement placés sur la grille');
//console.warn('TODO: quand on utilise un PinEditor et qu\'on appuie sur entrer pour valider, le svg ne reprend pas le focus');
//console.warn('TODO: quand on colle un graph, la position de la souris n\'est pas pris en compte');
console.warn('BUG: les StructurePin en output bug lors d\'un split');
console.warn('BUG: les liens depuis/vers les StructurePin "splitté" ne sont pas exporté');
//console.warn('BUG: quand on tire un lien depuis une pin PIN_INOUT et qu\'on affiche le LibraryMenu, le noeud se créee mais la Pin n\'est plus reliée');
console.warn('BUG: quand on copie/colle un node avec une pin special.add, la pin ne reapparait pas au bon endroit');
//console.warn('Reroute: quand on colle un node le exapnd n\'est pas pris en compte');
//console.warn('TODO: imlementer les flags pour les nodes.');
//console.warn('TODO: fermer le librarymenu quand on tape "echap"');
//console.warn('BUG: dans exGRAPH, si on specifie pas le chemin complet du type quand on creer une "pin datattype Array" le type n est pas trouvé dans la package');
console.warn('BUG: le redo genere une erreur lors d\'un redo sur les remplacements de liens');
console.warn('BUG: lors de l\'export de macro avec link, selon l\'ordre dans lequel on selectionne les noeuds a exporter');


