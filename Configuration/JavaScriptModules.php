<?php

return [
    'dependencies' => ['backend'],
    'tags' => [
        'backend.form',
    ],
    'imports' => [
        '@woit/wit-loremipsum/lorem-ipsum.js' => 'EXT:wit_loremipsum/Resources/Public/JavaScript/Ckeditor/lorem-ipsum.js',
    ],
];
