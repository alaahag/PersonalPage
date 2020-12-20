class Renderer {
    renderData(data, handlebarScript) {
        $('#content').empty();
        if (data.length !== 0) {
            const template = Handlebars.compile($(handlebarScript).html());
            $('#content').append(template(data));
            $('.materialboxed').materialbox();
            viewerEditorMode();
        }
    }

    renderCount(count, categoryElement) {
        $(categoryElement).find('.badge').text(`${count}`);
    }
}