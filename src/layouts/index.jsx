import React, { Component } from 'react';
import { Layout, ConfigProvider, notification, Icon } from 'antd';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import 'xterm/css/xterm.css';
import zhCN from 'antd/es/locale/zh_CN';
import MenuBox from '@/components/MenuBox';
import styles from './index.less';

const { Content, Sider } = Layout;

class BasicLayout extends Component {
    /**
     * 打开关闭label盒子
     */
    openBox(dispaly) {
        this.props.dispatch({
            type: 'global/updateState',
            payload: {
                labelDisplay: dispaly,
            },
        });
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'global/updateFiles',
        });
        window.socket.on('msg', data => {
            notification.open({
                message: data.msg,
                icon: data.status === 200 ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon type="close-circle" style={{ color: 'red' }} />,
            });
        });
        setInterval(() => {
            window.socket.emit('heart-link');
        }, 10000);
    }

    render() {
        const { labelDisplay } = this.props.global;

        return (
            <Layout style={{ height: '100%', minWidth: 1200 }}>
                <Layout>
                    <Sider width={200} style={{ background: '#30303d' }}>
                        <div className="logo" />
                        <MenuBox />
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px', background: '#23232e' }}>
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <ConfigProvider locale={zhCN}>
                                {this.props.children}
                            </ConfigProvider>
                        </Content>
                    </Layout>
                </Layout>
                <div className={styles.labelBox}>
                    {
                        labelDisplay
                            ? <div className={styles.labelIconActive} onClick={() => this.openBox(false)} />
                            : <div className={styles.labelIcon} onClick={() => this.openBox(true)} />
                    }
                </div>
            </Layout>
        );
    }
}

export default connect(({ global }) => ({ global }))(BasicLayout);
