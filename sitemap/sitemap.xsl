<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>
					<xsl:choose>
						<xsl:when test="sitemap:sitemapindex">XML Sitemap — Index</xsl:when>
						<xsl:otherwise>XML Sitemap — Post Type</xsl:otherwise>
					</xsl:choose>
				</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<style type="text/css">
					body{font-family:"Lucida Grande","Lucida Sans Unicode",Tahoma,Verdana,sans-serif;font-size:13px}
					#header,#footer{padding:2px;margin:10px;font-size:8pt;color:gray}
					a{color:black}
					td{font-size:11px}
					th{text-align:left;padding-right:30px;font-size:11px}
					tr.high{background-color:whitesmoke}
					#footer img{vertical-align:middle}
				</style>
			</head>
			<body>
				<h1>
					<xsl:choose>
						<xsl:when test="sitemap:sitemapindex">XML Sitemap — Index</xsl:when>
						<xsl:otherwise>XML Sitemap — Post Type</xsl:otherwise>
					</xsl:choose>
				</h1>
				<div id="header">
					<p>
						<xsl:choose>
							<xsl:when test="sitemap:sitemapindex">This XML Sitemap Index is generated to make your content more visible for search engines. </xsl:when>
							<xsl:otherwise>This XML Sitemap is generated to make your content more visible for search engines. </xsl:otherwise>
						</xsl:choose>
						<a href="https://www.sitemaps.org/">Learn more about XML sitemaps.</a>
					</p>
				</div>
				<div id="content">
					<xsl:choose>
						<xsl:when test="sitemap:sitemapindex">
							<table cellpadding="5">
								<tr class="high">
									<th>#</th>
									<th>XML Sitemap</th>
									<th>Last Modified</th>
								</tr>
								<xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
									<tr>
										<xsl:if test="position() mod 2 != 1">
											<xsl:attribute name="class">high</xsl:attribute>
										</xsl:if>
										<td><xsl:value-of select="position()"/></td>
										<td>
											<xsl:variable name="itemURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
											<a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td>
											<xsl:if test="sitemap:lastmod != ''">
												<xsl:value-of select="concat(substring(sitemap:lastmod,1,10),' ',substring(sitemap:lastmod,12,8),' (',substring(sitemap:lastmod,20,6),')')"/>
											</xsl:if>
										</td>
									</tr>
								</xsl:for-each>
							</table>
						</xsl:when>
						<xsl:otherwise>
							<table cellpadding="5">
								<tr class="high">
									<th>#</th>
									<th>URL</th>
									<th># Images</th>
									<th>Last Modified</th>
								</tr>
								<xsl:for-each select="sitemap:urlset/sitemap:url">
									<tr>
										<xsl:if test="position() mod 2 != 1">
											<xsl:attribute name="class">high</xsl:attribute>
										</xsl:if>
										<td><xsl:value-of select="position()"/></td>
										<td>
											<xsl:variable name="itemURL"><xsl:value-of select="sitemap:loc"/></xsl:variable>
											<a href="{$itemURL}"><xsl:value-of select="sitemap:loc"/></a>
										</td>
										<td>
											<xsl:if test="count(image:image) &gt; 0">
												<xsl:value-of select="count(image:image)"/>
											</xsl:if>
										</td>
										<td>
											<xsl:if test="sitemap:lastmod != ''">
												<xsl:value-of select="concat(substring(sitemap:lastmod,1,10),' ',substring(sitemap:lastmod,12,8),' (',substring(sitemap:lastmod,20,6),')')"/>
											</xsl:if>
										</td>
									</tr>
								</xsl:for-each>
							</table>
						</xsl:otherwise>
					</xsl:choose>
				</div>
				<div id="footer">
					<p>
						<img src="data:image/gif;base64,R0lGODlhUAAPAJEAAGZmZv////9mAImOeSwAAAAAUAAPAAACoISPqcvtD0+YtNqLs968myCE4kiW5jkGw8q27gvDwYfWdq3G+i7T9w/M8Ya7GQAUoiSTEyYSKYA2nSKhdXUdCIlaXzRVDVdB0+dS2lJZ1bkt0Sgti6NysvM5jbq2ai2WywJHYrZUaEhIWJXm99foNiRI9XUoV4g4GJjJyEgBGAkEivIIyPUZeppCqorlheo6ulr00UFba3uLEaG7y9urUAAAOw==" alt="XML Sitemap" title="XML Sitemap" />
						managed by <a href="https://status301.net/wordpress-plugins/xml-sitemap-feed/">XML Sitemap &amp; Google News</a>.
					</p>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
