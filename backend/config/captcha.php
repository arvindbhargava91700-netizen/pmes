<?php
return [
    'disable' => false,

    // 'characters' => array_merge(range('A', 'Z'), range(0, 9)),
    'characters' => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',

    'fontsDirectory' => resource_path('fonts'),
    'bgsDirectory'   => resource_path('captcha/backgrounds'),

    'fonts' => [
        resource_path('fonts/Roboto-Regular.ttf'),
    ],

    'default' => [
        'length'  => 6,
        'width'   => 345,
        'height'  => 65,
        'quality' => 90,
        'math'    => false,
        'expire'  => 60,
        'encrypt' => false,
        'bgImage' => false,
    ],
];
