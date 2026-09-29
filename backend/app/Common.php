<?php

/**
 * The goal of this file is to allow developers a location
 * where they can overwrite core procedural functions and
 * replace them with their own. This file is loaded during
 * the bootstrap process and is called during the framework's
 * execution.
 *
 * This can be looked at as a `master helper` file that is
 * loaded early on, and may also contain additional functions
 * that you'd like to use throughout your entire application
 *
 * @see: https://codeigniter.com/user_guide/extending/common.html
 */

if (!function_exists('clean_slug')) {
    /**
     * Generates a clean, accent-free ASCII slug safe for URLs and CodeIgniter routing.
     */
    function clean_slug(string $text, string $divider = '-'): string
    {
        // Transliterate accented characters (e.g. ó -> o, ñ -> n)
        $transliterator = function_exists('transliterator_transliterate')
            ? @transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text)
            : false;

        if ($transliterator !== false && $transliterator !== null && !empty($transliterator)) {
            $text = $transliterator;
        } else {
            $unwanted_array = [
                'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ü'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y'
            ];
            $text = strtr($text, $unwanted_array);
            if (function_exists('iconv')) {
                $iconv_text = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
                if ($iconv_text !== false) {
                    $text = $iconv_text;
                }
            }
        }

        // Replace non letter or digits by divider
        $text = preg_replace('~[^\pL\d]+~u', $divider, $text);

        // Remove unwanted non-alphanumeric chars
        $text = preg_replace('~[^-\w]+~', '', $text);

        // Trim
        $text = trim($text, $divider);

        // Remove duplicate divider
        $text = preg_replace('~-+~', $divider, $text);

        // Lowercase
        $text = strtolower($text);

        return !empty($text) ? $text : 'item';
    }
}
