package com.cyk.ttshop.service.impl;

import com.cyk.ttshop.dao.TbItemMapper;
import com.cyk.ttshop.pojo.po.TbItem;
import com.cyk.ttshop.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemServiceImpl implements ItemService{

    @Autowired
    private TbItemMapper itemDao;

    @Override
    public TbItem getById(Long itemId) {
        return itemDao.selectByPrimaryKey(itemId);
    }
}
