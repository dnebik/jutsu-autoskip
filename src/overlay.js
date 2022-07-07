export default `
    var video_overlay_array = [];
    if (typeof (video_music_intro) != 'undefined' || typeof (video_music_outro) != 'undefined') {
    preload_images_array([js_preres_url + '/templates/school/images/listen_on_am_white.png',
    js_preres_url + '/templates/school/images/listen_on_am_black.png']);
    }
    if (typeof (video_intro_end) != 'undefined') {
    var video_intro_start_end = parseInt(video_intro_start) + 15;
    if (parseInt(video_intro_start) == 0) video_intro_start = parseFloat(video_intro_start) + 0.3;
    var video_intro_object = {
      content: 'Пропустить заставку',
      start: video_intro_start,
      end: video_intro_start_end,
      end2: 'change_video_src',
      align: 'bottom-left',
      class : 'vjs-overlay-skip-intro',
      the_function: 'skip_video_intro',
      title: 'Нажмите, если лень смотреть опенинг'
    };
    video_overlay_array.push(video_intro_object);
    }
    if (typeof (video_outro_start) != 'undefined') {
    var video_outro_start_end = parseInt(video_outro_start) + 20;
    if (js_isset(next_episode_link)) {
      var video_outro_object = {
        content: 'Следующая серия',
        start: video_outro_start,
        end: video_outro_start_end,
        end2: 'change_video_src',
        align: 'bottom-right',
        class : 'vjs-overlay-skip-intro',
        the_function: 'video_go_next_episode',
        title: 'Перейти к следующему эпизоду'
      };
      video_overlay_array.push(video_outro_object);
    }
    }
    if (js_isset(next_episode_link) && typeof (this_video_duration) != 'undefined') {
    var video_outro_real_start = parseInt(this_video_duration) - 5;
    if (video_outro_real_start > 10 && ((typeof (video_outro_start_end) != 'undefined' && video_outro_real_start - 10 > video_outro_start_end) || typeof (video_outro_start_end) == 'undefined')) {
      var video_outro_real_start_end = video_outro_real_start + 10;
      var video_real_outro_object = {
        content: 'Следующая серия',
        start: video_outro_real_start,
        end: video_outro_real_start_end,
        end2: 'change_video_src',
        align: 'bottom-right',
        class : 'vjs-overlay-skip-intro',
        the_function: 'video_go_next_episode',
        title: 'Перейти к следующему эпизоду'
      };
      video_overlay_array.push(video_real_outro_object);
    }
    }
    if (typeof (some_achiv_str) != 'undefined') {
    eval(Base64.decode(some_achiv_str));
    if (typeof (this_anime_achievements) != 'undefined' && this_anime_achievements.length > 0) {
      achievement_audio = new Audio();
      achievement_audio.src = js_preres_url + '/templates/school/images/achiv/achievement_sound_silent2.mp3';
      achievement_audio.load();
      document.fonts.load('16px FRQuadrata');
      if (typeof (this_anime_achievements_icons) != 'undefined' && this_anime_achievements_icons.length > 0) preload_images_array(this_anime_achievements_icons);
      var rindex_a;
      for (rindex_a = 0; rindex_a < this_anime_achievements.length; ++rindex_a) {
        var ach_hr = this_anime_achievements[rindex_a];
        ach_hr.time_end = ach_hr.time_start + 1;
        video_overlay_array.push({
          content: '<div class="achievement_full_length achievement_main_full">\\n' + '\\n' + '                <div class="achievement_full_length achievement_main_base">\\n' + '                    <div class="achievement_text_style">\\n' + '                        <div class="achievement_text_style_top">&laquo;' + ach_hr.title + '&raquo;</div>\\n' + '                        <div class="achievement_text_style_bottom">' + ach_hr.description + '</div>\\n' + '                    </div>\\n' + '                </div>\\n' + '\\n' + '                <div class="achievement_main_blink"></div>\\n' + '                <div class="achievement_full_length achievement_main_glow"></div>\\n' + '                <div class="achievement_badge_icon" style="background: url(\\'' + ach_hr.icon + '\\') no-repeat; background-size: cover;"></div>\\n' + '                <div class="achievement_main_badge_frame"></div>\\n' + '            </div>',
          start: ach_hr.time_start,
          end: ach_hr.time_end,
          align: 'bottom',
          class : 'vjs-overlay-nobg achievement_vjs_margin',
          only_once: true,
          is_showed: false,
          dont_hide: true,
          achiv_id: ach_hr.id,
          achiv_hash: ach_hr.hash
        });
      }
    }
    }
    if (video_overlay_array.length > 0) {
    player.overlay({
      content: 'Default overlay content',
      debug: false,
      overlays: video_overlay_array
    });
    }
`;
