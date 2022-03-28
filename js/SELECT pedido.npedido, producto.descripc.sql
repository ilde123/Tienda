SELECT pedido.npedido, producto.descripcion, lpedido.unidades, lpedido.precio, pedido.fecha FROM lpedido
INNER JOIN producto ON lpedido.codigo = producto.codigo
INNER JOIN pedido ON pedido.npedido = lpedido.npedido
ORDER BY pedido.fecha DESC;