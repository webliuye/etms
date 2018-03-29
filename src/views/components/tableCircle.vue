<template>
      <table width="100%" border="1">
        <tbody>
            <tr>
              <td rowspan="2">这是第1列</td>
              <td>这是第2列</td>
              <td>这是第3列</td>+
            </tr>
            <tr>
              <td>这是第2行2列</td>
              <td>这是第2行3列</td>
            </tr>
        </tbody>
          <tbody>
            <tr>
              <td rowspan="2">这是第1列</td>
              <td>这是第2列</td>
              <td>这是第3列</td>
            </tr>
            <tr>
              <td>这是第2行2列</td>
              <td>这是第2行3列</td>
            </tr>
        </tbody>
      </table> 
</template>

<script>
    export default {
        name: 'circleTable',
       
         data() {
            return {
            }
        },       
        
    }
</script>
<style type="text/less">
 
</style>