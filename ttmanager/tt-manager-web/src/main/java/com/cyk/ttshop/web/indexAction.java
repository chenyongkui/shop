package com.cyk.ttshop.web;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Scope("prototype")
public class indexAction {
    @RequestMapping("/")
    public String index() {
        return "index";
    }
}
